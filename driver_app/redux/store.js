import {configureStore} from "@reduxjs/toolkit";
import { driverReducer,  userReducer } from "./reducer";



export const store = configureStore({
    reducer:{
        user:userReducer,
        driver:driverReducer
    }
})