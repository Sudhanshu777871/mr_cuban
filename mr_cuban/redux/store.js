import {configureStore} from "@reduxjs/toolkit";
import { carReducer, orderReducer, userReducer } from "./reducer";



export const store = configureStore({
    reducer:{
        user:userReducer,
        order:orderReducer,
        car:carReducer
    }
})