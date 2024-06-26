import axios from "axios";
import type {AxiosInstance} from "axios"
import {VUE_APP_FB_URL} from "~/utils/composables/constants";


const requestAxios: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
})

requestAxios.interceptors.response.use(
    response => response,
    error => {
        const router = useRouter()
        if (error.response && error.response.status === 401) {
            // router.push({name: 'signin'})
        }
        return Promise.reject(error)
    }
);

export default requestAxios