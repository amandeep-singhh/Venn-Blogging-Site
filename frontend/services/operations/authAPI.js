import axios from "axios"
import { authEndpoints } from "../apis"
import { storeinSession } from "../../src/common/session";
import { setUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { store } from "../../redux/store";

const { SIGNIN_API, SIGNUP_API } = authEndpoints;

const signinAndSignup = async (serverRoute, formData) => {
    let api = serverRoute == '/signin' ? SIGNIN_API : SIGNUP_API;

    axios.post(api, formData)
        .then(({ data }) => {
            storeinSession("user", JSON.stringify(data))
            store.dispatch(setUser(data))

        })
        .catch(({ response }) => {
            toast.error(response?.data?.error)
        })

}

export { signinAndSignup }