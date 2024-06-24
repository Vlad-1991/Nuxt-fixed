import requestAxios from "~/services/api/index"
import {VUE_APP_FB_KEY} from "~/utils/composables/constants";

export async function login(payload: {email: string, password: string }): Promise<any> {

    const url: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${VUE_APP_FB_KEY}`
    const {data} = await requestAxios.post(url, {...payload, returnSecureToken: true})
    return data
}