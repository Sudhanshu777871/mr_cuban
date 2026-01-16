import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import img from "../../assets/img/login.jpg";
import AuthButton from "../../components/AuthButton";
import { useSelector } from "react-redux";
import { CreateRide } from "../../api/other";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";

const AddRide = () => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [no, setNo] = useState("");
  const [seat, setSeat] = useState("");
  const [image, setImage] = useState([]);

  const [loading, setLoading] = useState(false);

  // Function to pick images
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let selectedImages = [];

    // Pick 4 images
    for (let i = 0; i < 2; i++) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        selectedImages.push(result.assets[0].uri); // Collect selected image URIs
      } else {
        break; // Stop picking if the user cancels
      }
    }

    setImage(selectedImages);
  };

  const handleCreate = async () => {
    try {
      if (name === "")
        return ToastAndroid.show("Model Name is required", ToastAndroid.SHORT);
      if (no === "")
        return ToastAndroid.show(
          "Model Number is required",
          ToastAndroid.SHORT
        );
      if (seat === "")
        return ToastAndroid.show("Seat Count is required", ToastAndroid.SHORT);
      if (image?.length === 0)
        return ToastAndroid.show("Images is required", ToastAndroid.SHORT);
      setLoading(true);

      const myForm = new FormData();
      myForm.append("id", user?._id);
      myForm.append("name", name);
      myForm.append("no", no);
      myForm.append("seat", seat);
      image.forEach((imageUri, index) => {
        myForm.append("images", {
          uri: imageUri,
          name: `photo_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const result = await CreateRide(myForm);

      if (result?.data?.data) {
        ToastAndroid.show("Ride Create Successfully", ToastAndroid.SHORT);
        setName("");
        setNo("");
        setSeat("");
      } else {
        ToastAndroid.show("Ride Create Failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.h2}>Add Vicheles</Text>
          <Text style={styles.p}>
            Welcome! Manage your account, view bookings, and update preferences.
            Your vehicle will be activated after admin confirmation.
          </Text>
        </View>

        <Text style={styles.h4}>Rides Details</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Model Name</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={"#454545"}
            value={name}
            onChangeText={(e) => setName(e)}
            placeholder="Enter Model Name"
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Vichele Registation Number</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={"#454545"}
            value={no}
            placeholder="Enter RTO Number"
            onChangeText={(e) => setNo(e)}
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Seat</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={"#454545"}
            value={seat}
            placeholder="Enter Seat Number"
            onChangeText={(e) => setSeat(e)}
          />
        </View>
        <Text style={styles.label}>Upload Image</Text>
        <TouchableOpacity onPress={pickImages} style={styles.upload}>
          <Feather name="upload" size={24} color={colors.primary} />
          <Text
            style={{
              fontSize: 12,
              colors: "#454545",
              lineHeight: 14,
              textAlign: "center",
              width: "90%",
            }}
          >
            Please upload 1 to 2 images of your vehicle. You can upload up to 2
            images to ensure the best representation of your vehicle.
          </Text>
        </TouchableOpacity>

        <View
          style={{
            display: "flex",
            alignItem: "center",
            flexDirection: "row",
            gap: 10,
            marginBottom: 10,
          }}
        >
          {image?.map((d, i) => (
            <Image
              key={i}
              source={{ uri: d }}
              style={{ width: 50, height: 50, borderRadius: 5 }}
            />
          ))}
        </View>

        <AuthButton
          loading={loading}
          handlePress={handleCreate}
          title={"Add Vichele"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddRide;

const styles = StyleSheet.create({
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  h4: {
    color: "#454545",
    fontSize: 16,
    fontWeight: "regular",
    fontFamily: "regular",
    marginBottom: 15,
    marginTop: 15,
  },
  p: {
    color: "#454545",
    textAlign: "justify",
    fontSize: 14,
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: 20,
  },
  form: {
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "regular",
    fontFamily: "regular",
    color: "#454545",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    color: "#454545",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    outlineStyle: "none",
    marginTop: 5,
  },
  upload: {
    backgroundColor: "whitesmoke",
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "dashed",
  },
});
