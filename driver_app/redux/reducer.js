import { createReducer } from "@reduxjs/toolkit";

export const userReducer = createReducer(
  { isValid: false, user: null,amount:0,uf:false },
  (builder) => {
    builder
      .addCase("login", (state, action) => {
        state.isValid = true;
        state.user = action.payload;
      })
      .addCase("load", (state, action) => {
        state.isValid = true;
        state.user = action.payload.data;
        state.amount = action.payload.total;
      })
      .addCase("logout", (state, action) => {
        state.isValid = false;
        state.user = null;
      }).addCase("force_call",(state,action)=>{
        state.uf=true
      })
  }
);



export const driverReducer = createReducer({order:null,orderDetail:null }, (builder) => {
  builder
    
   .addCase("addOrder", (state, action) => {
      state.order = action.payload;
    }).addCase("orderDetail", (state, action) => {
      state.orderDetail = action.payload;
    })
});


