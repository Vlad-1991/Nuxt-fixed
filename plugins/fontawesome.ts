import { defineNuxtPlugin } from '#app'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faShoppingCart, faWindowClose, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faShoppingCart, faWindowClose, faTrashAlt)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('fa', FontAwesomeIcon)
})