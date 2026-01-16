import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Provider, useSelector } from "react-redux";
import { store } from "../redux/store";
import { CallProvider } from "../context/CallContext";



SplashScreen.preventAutoHideAsync();

const RootLayout = () => {



  const [fontsLoaded, error] = useFonts({
    extra: require("../assets/fonts/Lato-Black.ttf"),
    bold: require("../assets/fonts/Lato-Bold.ttf"),
    regular: require("../assets/fonts/Lato-Regular.ttf"),
    light: require("../assets/fonts/Lato-Light.ttf"),
    thin: require("../assets/fonts/Lato-Thin.ttf"),
  });

 

  //Mechanism of fonts loaded in expo app
  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;









  return (
    <Provider store={store}>
      <CallProvider>
        <Slot/>
      </CallProvider>
    </Provider>
  );
};

export default RootLayout;


