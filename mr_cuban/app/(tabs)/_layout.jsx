import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import img1 from "../../assets/icons/home.png";
import img2 from "../../assets/icons/offer.png";
import img3 from "../../assets/icons/history.png";
import img4 from "../../assets/icons/account.png";

const TabIcon = ({ icon, name, color, focused }) => {
  return (
    <View style={{display:"flex",alignItems:"center"}}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 15, height: 15 ,marginBottom:4}}
      />
      <Text style={{fontWeight:focused ? 500:400,color:"#fff"}}>{name}</Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "#cdcde0",
          tabBarStyle: {
            backgroundColor: "#000",
            borderTopWidth: 1,
            borderTopColor: "silver",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={img1}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
         <Tabs.Screen
          name="history"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={img3}
                color={color}
                name="Orders"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="offers"
          options={{
            title: "Offers",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={img2}
                color={color}
                name="Offers"
                focused={focused}
              />
            ),
          }}
        />
         <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={img4}
                color={color}
                name="Account"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
