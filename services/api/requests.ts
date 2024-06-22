import { useNuxtApp, useAsyncData } from '#app'

export async function load(key: string, url: string){
    const { $axios } = useNuxtApp()

    return useAsyncData( key, async () => {
        const timestamp = new Date().getTime() // Унікальний параметр для уникнення кешування
        const {data} = await $axios.get(`${url}?timestamp=${timestamp}`)
        return data
    })
}
