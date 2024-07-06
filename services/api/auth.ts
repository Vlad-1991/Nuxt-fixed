import requestAxios from "~/services/api/index"

export async function login(payload: {email: string, password: string }): Promise<any> {
    const url: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${VUE_APP_FB_KEY}`
    const {data} = await requestAxios.post(url, {...payload, returnSecureToken: true})
    return data
}

export async function signUp(payload: {email: string, password: string}){
    const url: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${VUE_APP_FB_KEY}`
    const {data} = await requestAxios.post(url, {...payload, returnSecureToken: true})
    return data
}

export async function resetPassword(payload: {"requestType": string, email: string}): Promise<any> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${VUE_APP_FB_KEY}`
    const response = await requestAxios.post(url, payload)
    return response
}

export async function getEmailFromToken(token: string): Promise<any>{
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${VUE_APP_FB_KEY}`
    const response = await requestAxios.post(url, {"idToken": token})
    const users = response.data
    return users
}

export async function changePassword(password: string, token: string): Promise<void>{
    const AuthStore = useAuthStore()
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${VUE_APP_FB_KEY}`
    const response = await requestAxios.post(url,
        {"idToken": token, "password": password, "returnSecureToken": true})
    AuthStore.setToken(response.data.idToken)
    await login({"email": AuthStore.email, "password": password})
    await AuthStore.setUserInfo()
}