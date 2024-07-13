import axios from "axios";
import type {AxiosInstance} from "axios"


const requestAxios: AxiosInstance = axios.create({
    baseURL: process.env.APP_URL

})

requestAxios.interceptors.response.use(
    response => response,
    error => {
        const router = useRouter()
        const AuthStore = useAuthStore()
        if (error.response && error.response.status === 401) {
            AuthStore.logout()
        }
        return Promise.reject(error)
    }
);

export default requestAxios