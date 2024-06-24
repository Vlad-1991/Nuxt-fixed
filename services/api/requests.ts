import { useNuxtApp, useAsyncData } from '#app'
import requestAxios from "~/services/api/index";

export async function load(key: string, url: string): Promise<any>{

    return useAsyncData( key, async () => {
        const timestamp = new Date().getTime() // Unique parameter to avoid caching
        const {data} = await requestAxios.get(url)
        return data
    })
}
