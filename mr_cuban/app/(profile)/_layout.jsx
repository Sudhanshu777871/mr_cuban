import {  StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
   <>
   <Stack>
    <Stack.Screen name='update-profile' options={{headerShown:false}}/>
    <Stack.Screen name='aboutus' options={{headerShown:false}}/>
    <Stack.Screen name='feedback' options={{headerShown:false}}/>

   </Stack>
   <StatusBar backgroundColor="#000" style="light"/>
   </>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})