import { Driver } from "../models/driver.js";
import { User } from "../models/user.js";
import { DriverOrder } from "../models/driverOrder.js";
import { CustomerOrder } from "../models/order.js";
import { Lead } from "../models/lead.js";
import { ActivationHTML } from "../templates/templates.js";
import { sendMails } from "../utils/SendMails.js";

export const FetchDrivers = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await Driver.countDocuments();
    const data = await Driver.find({})
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 });

    return res.status(200).json({ msg: "success", data, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const FetchUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await User.countDocuments();
    const data = await User.find({})
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 });

    return res.status(200).json({ msg: "success", data, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const AccountVerify = async (req, res) => {
  try {
    const { id } = req.query;

    const check = await Driver.find({ _id: id }, "verify");

    const data = await Driver.findByIdAndUpdate(
      { _id: id },
      { verify: check[0]?.verify === true ? false : true }
    );

    // User Mail send
    if (check[0]?.verify === false) {
      const subject =
        "Congratulations! Your MR Cuban Partners Account is Now Activated";
      const message = ActivationHTML(data?.email, data?.password);

      await sendMails(data?.email, subject, message);
    }

    return res
      .status(200)
      .json({ msg: "Account Activate Successfully", data: [] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const LoginAPI = async (req, res) => {
  try {
    const { email, password } = req.query;

    if (email === "mrcuban@gmail.com" && password === "zxc123cuban") {
      return res.status(200).json({
        msg: "Login sucess",
        data: [
          {
            email: "mrcuban@gmail.com",
            token:
              "zxcvbnmcuban345cubanjhjfshdfjhdsf77243zssssssxzdfdf24r234q213423x2qwAWEXRXTGEXRGTERTE",
          },
        ],
      });
    } else {
      return res.status(400).json({ msg: "Invalid Credintials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const FetchDriverOrders = async (req, res) => {
  try {
    const { page, limit, id } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await DriverOrder.countDocuments({ driverId: id });
    const data = await DriverOrder.find({ driverId: id })
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 }).lean(true);
    let newData = [];
    for (let i = 0; i < data?.length; i++) {
      const customer = await User.findOne(
        { _id: data[i]?.customerId },
        "name email phone"
      );
      newData.push({ ...data[i], customerDetails: customer });
    }

    return res.status(200).json({ msg: "success", data: newData, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const FetchUserOrders = async (req, res) => {
  try {
    const { page, limit, id } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await CustomerOrder.countDocuments({ customerId: id });
    const data = await CustomerOrder.find({ customerId: id })
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 });

    return res.status(200).json({ msg: "success", data, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const FetchCurrentRides = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    // Count total: both accepted/started orders AND pending leads
    const acceptedOrdersCount = await CustomerOrder.countDocuments({
      status: { $in: ["accept", "start"] }
    });
    const pendingLeadsCount = await Lead.countDocuments({
      status: "pending"
    });
    const total = acceptedOrdersCount + pendingLeadsCount;

    console.log(`[FetchCurrentRides] Accepted Orders: ${acceptedOrdersCount}, Pending Leads: ${pendingLeadsCount}, Total: ${total}`);

    // Fetch accepted/started orders
    const customerOrders = await CustomerOrder.find({
      status: { $in: ["accept", "start"] }
    })
      .sort({ createdAt: -1 })
      .lean(true);

    // Fetch pending leads
    const pendingLeads = await Lead.find({
      status: "pending"
    })
      .sort({ createdAt: -1 })
      .lean(true);

    console.log(`[FetchCurrentRides] Found ${customerOrders.length} customer orders and ${pendingLeads.length} pending leads`);

    // Combine and sort all rides
    let allRides = [];

    // Process accepted/started customer orders
    for (let order of customerOrders) {
      const customer = await User.findOne(
        { _id: order.customerId },
        "name phone email"
      );

      const negotiatedDrivers = order.driver || [];

      let assignedDriver = null;
      if (order.driverOrderId) {
        const driverOrder = await DriverOrder.findOne({ _id: order.driverOrderId });
        if (driverOrder) {
          const driverInfo = await Driver.findOne(
            { _id: driverOrder.driverId },
            "name phone"
          );
          assignedDriver = {
            driverId: driverOrder.driverId,
            driverName: driverInfo?.name || "N/A",
            driverPhone: driverInfo?.phone || "N/A",
            rideAmount: driverOrder.price
          };
        }
      }

      allRides.push({
        orderId: order._id,
        customerId: order.customerId,
        customerName: customer?.name || "N/A",
        customerPhone: customer?.phone || "N/A",
        rideFrom: order.distance1,
        rideTo: order.distance2,
        pickupDate: order.date1,
        pickupTime: order.date1,
        status: order.status,
        negotiatedDrivers: negotiatedDrivers.map(d => ({
          name: d.name,
          price: d.price
        })),
        assignedDriver: assignedDriver,
        createdAt: order.createdAt
      });
    }

    // Process pending leads
    for (let lead of pendingLeads) {
      const customer = await User.findOne(
        { _id: lead.customer_id },
        "name phone email"
      );

      // Get negotiated drivers from lead
      const negotiatedDrivers = [];

      // From drivers array (driver quotes)
      if (lead.drivers && lead.drivers.length > 0) {
        for (let driver of lead.drivers) {
          negotiatedDrivers.push({
            name: driver.name || "N/A",
            price: driver.price || 0
          });
        }
      }

      // From negotiation array (customer counter-offers)
      if (lead.negotiation && lead.negotiation.length > 0) {
        for (let nego of lead.negotiation) {
          negotiatedDrivers.push({
            name: nego.name || "N/A",
            price: nego.price || 0
          });
        }
      }

      allRides.push({
        orderId: lead._id,
        customerId: lead.customer_id,
        customerName: customer?.name || "N/A",
        customerPhone: customer?.phone || "N/A",
        rideFrom: lead.pickup_address,
        rideTo: lead.drop_address,
        pickupDate: lead.pickup_date,
        pickupTime: lead.pickup_time,
        status: "pending",
        negotiatedDrivers: negotiatedDrivers,
        assignedDriver: null,
        createdAt: lead.createdAt
      });
    }

    // Sort all rides by creation date (newest first)
    allRides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`[FetchCurrentRides] Total combined rides: ${allRides.length}`);
    console.log(`[FetchCurrentRides] Status distribution:`, allRides.map(r => r.status));

    // Apply pagination
    const paginatedRides = allRides.slice(skip, skip + pageSize);

    console.log(`[FetchCurrentRides] Returning ${paginatedRides.length} rides (page ${pageNo})`);

    return res.status(200).json({ msg: "success", data: paginatedRides, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};
