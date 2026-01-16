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
    <Stack.Screen name='add-ride' options={{headerShown:false}}/>
    <Stack.Screen name='comment' options={{headerShown:false}}/>
    <Stack.Screen name='rides' options={{headerShown:false}}/>



    
   </Stack>
   <StatusBar backgroundColor="#161622" style="light"/>
   </>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})