import {load, updateUser} from "~/services/api/requests";
import {getEmailFromToken} from "~/services/api/auth";

// const encode = (email: string): string => {
//     return email.replace(/[@.]/g, '_');
// }

export const useAuthStore = defineStore("AuthStore", {
    /* by default user isnt authorized */
    state: (): authType => {
        return {
            userName: '',
            email: '',
            country: '',
            adress: '',
            phone: '',
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

        async setUserInfo(userData?: {}): Promise<void> {

            if(userData){
                this.userName = userData.name
                this.zip = userData.zip
                this.email = userData.email
                this.country = userData.country
                this.adress = userData.address
                this.phone = userData.phone
                this.orders = userData.orders
                this.promo = userData.promo
            }

            if(this.getToken){
                try{
                    const data = await getEmailFromToken(this.getToken)

                    if (data.users && data.users.length > 0) {
                        const user = data.users[0];
                        const userEmail = user.email;
                         const userData = await load(VUE_APP_FB_URL + `/users/${encode(userEmail)}.json?auth=${this.getToken}`)
                        this.userName = userData.name
                        this.zip = userData.zip
                        this.email = userData.email
                        this.country = userData.country
                        this.adress = userData.address
                        this.phone = userData.phone
                        this.orders = userData.orders
                        this.promo = userData.promo
                    }

                }catch (e: string | unknown) {
                    const UiStore = useUiStore()
                    UiStore.setErrorMessage(e.message);
                }
            }


        },
        async updateUserinfo(country: string, adress: string, zip: string, phone: string, name: string): Promise<void> {
            let userData: userDataType = {
                'country': country,
                'address': adress,
                'zip': zip,
                'phone': phone,
                'email': this.email,
                'orders': this.orders,
                'promo': this.promo,
                'name': name
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