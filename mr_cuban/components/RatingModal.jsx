import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { colors } from "../assets/color";
import AntDesign from "@expo/vector-icons/AntDesign";
import { createCommentAPI } from "../api/order";

const RatingModal = ({ modalVisible, setModalVisible, data, id }) => {
  const [rate, setRate] = useState(0);
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);


  const submit = async () => {
    try {
      if (rate === 0) {
        return ToastAndroid.show("Rating is required!", ToastAndroid.SHORT);
      }
      if (comment === "")
        return ToastAndroid.show(
          "Comment can not be empty",
          ToastAndroid.SHORT
        );

      setLoading(true);

      const result = await createCommentAPI(data?.driver[0]?._id || data?.driver[0]?.driverId, id, comment, rate);
      if (result?.data?.data) {
        ToastAndroid.show(
          "Feedback submitted successfully! Thank you for your rating.",
          ToastAndroid.LONG
        );
        // Reset form
        setRate(0);
        setComment("");
        setModalVisible(false);
      } else {
        ToastAndroid.show(
          "Failed to submit feedback. Please try again.",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Error submitting feedback. Please check your connection and try again.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide" // You can change it to 'fade' or 'none'
      transparent={true} // Make the modal background transparent
      visible={modalVisible} // Controls visibility of modal
      onRequestClose={() => setModalVisible(false)} // Closes modal on back press (Android)
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.h}>Rate Your Experience</Text>
          <Text style={styles.modalText}>Let us know your experience.</Text>

          <Text style={{ marginTop: 10, fontFamily: "bold" }}>
            Select Rating
          </Text>
          <View style={styles.rating}>
            {star?.map((d, index) => (
              <TouchableOpacity key={index} onPress={() => setRate(index + 1)}>
                <AntDesign
                  name="star"
                  size={24}
                  color={index < rate ? colors?.primary : "black"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ marginTop: 20, fontFamily: "bold" }}>Comment</Text>
          <TextInput
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "#000",
              marginTop: 10,
              borderRadius: 5,
              padding: 5,
            }}
            placeholder="Write your experince"
            numberOfLines={1}
            onChangeText={(e) => setComment(e)}
            value={comment}
          />

          <View style={styles.set}>
            <TouchableOpacity
              style={styles.confirm}
              disabled={loading}
              onPress={submit}
            >
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator /> : "Submit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    width: "90%",
    height: 300,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  h: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 13,
  },
  set: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    left: 10,
    gap: 10,
  },
  confirm: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  rating: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
