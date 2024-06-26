import { useNuxtApp, useAsyncData } from '#app'
import requestAxios from "~/services/api/index";
import type {categoriesType, userDataType} from "~/utils/types/requestTypes";
import {ORDERS_DATABASE} from "~/utils/composables/constants";
import {useUiStore} from "~/stores/UiStore";

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

export const loadCategoriesToStore = async () => {

    const UiStore = useUiStore()
    try {
        const {data} = await load('categories', '/categories.json')

        let response = data.value
        response.sort((a: categoriesType, b: categoriesType) => Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1);

        UiStore.pushCategories(response);

    } catch (e: string | unknown) {
        UiStore.setErrorMessage(e.message);
    }
}