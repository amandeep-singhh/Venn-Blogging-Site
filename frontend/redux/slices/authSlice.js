import { createSlice } from "@reduxjs/toolkit";
import { storeinSession } from "../../src/common/session";

const initialState = {
    user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setUser: (state, value) => {
            state.user = value.payload;
        },
        setUserProfileImg:(state,value)=>{
            state.user.profile_img=value.payload;
            storeinSession("user", JSON.stringify(state.user))
        },
        setUsername:(state,value)=>{
            state.user.username=value.payload;
            storeinSession("user", JSON.stringify(state.user))
        },
        setNewNotificationAvailable:(state,value)=>{
            state.user.newNotificationAvailable=value.payload;
        },
    }
})

export const { setUser,setUserProfileImg,setUsername,setNewNotificationAvailable } = authSlice.actions;
export default authSlice.reducer;