import { useNuxtApp, useAsyncData } from '#app'
import requestAxios from "~/services/api/index";
import type {userData, userDataType} from "~/utils/types/requestTypes";

export async function load(key: string, url: string): Promise<any>{

    return useAsyncData( key, async () => {
        const {data} = await requestAxios.get(url)
        return data
    })
}


export async function updateUser(url: string, userData: userDataType): Promise<any>{
    const data = await requestAxios.put(url, userData)
    return data
}