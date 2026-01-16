import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const CustomCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  // Calculate the time difference between now and the target date
  function calculateTimeLeft(targetDate) {
    // Convert targetDate to a valid format
    const [dateString, timeString] = targetDate.split(" ");
    const [month, day, year] = dateString.split("/");
    const formattedDate = `${year}-${month}-${day}T${timeString}`; // Convert to YYYY-MM-DDTHH:mm:ss format

    const difference = new Date(formattedDate) - new Date();

    

    if (difference > 0) {
      return {
        day: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hr: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        sec: Math.floor((difference / 1000) % 60),
      };
    }
    return {}; // Return an empty object if the countdown is over
  }

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(timer);
  }, [targetDate]);

  // Format the countdown display
  const renderTimerComponents = () => {
    const timerComponents = Object.entries(timeLeft)
      .filter(([_, value]) => value !== undefined) // Only display non-zero values
      .map(([key, value]) => (
        <Text key={key}>
          {value} {key}{" "}
        </Text>
      ));

    if (timerComponents.length) {
      return timerComponents;
    }
    return <Text>Get Start Ride</Text>;
  };

  return (
    <View>
      <Text
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {renderTimerComponents()}
      </Text>
    </View>
  );
};

export default CustomCountdown;
