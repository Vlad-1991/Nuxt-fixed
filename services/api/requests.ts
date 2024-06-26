import { useNuxtApp, useAsyncData } from '#app'
import requestAxios from "~/services/api/index";
import type {userDataType} from "~/utils/types/requestTypes";
import {ORDERS_DATABASE} from "~/utils/composables/constants";

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

export async function addOrder(url: string, order: { [key: string]: (string | boolean | {}) }): Promise<any>{
    const data = await requestAxios.post(url, order)
    return data
}

export async function loadOrdersById(email: string){
     const {data} = await requestAxios.get(ORDERS_DATABASE)
    return data
}

export async function updateInDatabase(url: string, updatedObject: {}): Promise<void>{
    await requestAxios.put(url, updatedObject)
}