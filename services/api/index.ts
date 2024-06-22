import axios from "axios";
import type {AxiosInstance} from "axios"


const requestAxios: AxiosInstance = axios.create({
    // baseURL: process.env.VUE_APP_FB_URL
})

requestAxios.interceptors.response.use(null, (error: Error) => {
    // if(error.response.status === 401){
    //     router.push('/auth?message=auth')
    // }

    return Promise.reject(error);
});

export default requestAxios