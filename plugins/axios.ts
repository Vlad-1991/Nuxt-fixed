
import { defineNuxtPlugin } from '#app'
import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
    const instance = axios.create({
        baseURL: process.env.VUE_APP_FB_URL || 'http://localhost:3000'
    })

    // Додаємо інтерсептори
    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                // Обробка помилки 401
                error({ statusCode: 401, message: 'Unauthorized' })
            }
            return Promise.reject(error)
        }
    )

    // Додаємо екземпляр Axios до Nuxt App
    nuxtApp.provide('axios', instance)
})