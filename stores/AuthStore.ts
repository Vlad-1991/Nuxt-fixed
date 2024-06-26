import type {authType} from "@/utils/types/storeTypes";
import {load, updateUser} from "~/services/api/requests";
import {VUE_APP_FB_URL} from "~/utils/composables/constants";
import type {userDataType} from "~/utils/types/requestTypes";
import {useUiStore} from "~/stores/UiStore";

const encode = (email: string): string => {
    return email.replace(/[@.]/g, '_');
}


export const useAuthStore = defineStore("AuthStore", {
    /* by default user isnt authorized */
    state: (): authType => {
        return {
            userName: '',
            email: '',
            country: '',
            adress: '',
            phone: '',
            orders: [],
            promo: {},
            token: '',
            zip: ''
        }
    },
    getters: {
        getToken(): string | null {
            return this.token
        },
        getUserName(): string | null | undefined {
            if (this.userName) {
                return this.userName
            }
        },
        getUserId(): string | null | undefined {
            if (this.email) {
                return this.email
            }
        },
        isAuthentificated(): boolean {
            return !!this.getToken
        },
        getPromoCode(): string | null{
            return this.promo.code
        },
        getPromoValue(): string | null{
            return this.promo.value
        },
        getPromoDiscount(): number | null{
            return this.promo.discount
        }
    },
    actions: {
        setToken(token: string): void {
            localStorage.setItem('TOKEN_KEY', token)
            this.token = token
        },
        logout(): void {
            this.token = null
            localStorage.removeItem('TOKEN_KEY')
        },
        async prepareToken(): Promise<void> {
            const token = localStorage.getItem('TOKEN_KEY')
            if (token) {
                this.token = token
            }
        },

        async setUserInfo(): Promise<void> {

            if(this.getToken){
                try{
                    let data = await load('userData', VUE_APP_FB_URL + `/users/v_gmail_com.json?auth=${this.getToken}`)

                    let userData = data.data.value


                    this.userName = userData.name
                    this.zip = userData.zip
                    this.email = userData.email
                    this.country = userData.country
                    this.adress = userData.address
                    this.phone = userData.phone
                    this.orders = userData.orders
                    this.promo = userData.promo
                }catch (e: string | unknown) {
                    const UiStore = useUiStore()
                    UiStore.setErrorMessage(e.message);
                }
            }


        },
        async updateUserinfo(country: string, adress: string, zip: string, phone: string): Promise<void> {
            let userData: userDataType = {
                'country': country,
                'address': adress,
                'zip': zip,
                'phone': phone,
                'email': this.email,
                'orders': this.orders,
                'promo': this.promo,
                'name': this.userName
            }

            try {
                await updateUser(VUE_APP_FB_URL + `/users/${encode(this.email)}.json?auth=${this.getToken}`, userData)
            }catch (e) {
                const UiStore= useUiStore()
                UiStore.setErrorMessage(e.message);
            }

        }
    }
})