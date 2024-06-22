
import type {authType} from "@/utils/types/storeTypes";

/* stub to simulate, that user authorized */
let stub = (): authType => {
    return {userName: 'Joy Carson', userId: 'joycarson@gmail.com'}
}


export const useAuthStore = defineStore("AuthStore", {
    /* by default user isnt authorized */
    state: (): authType => {
        return {
        userName: '',
        userId: ''
    }
    //     return stub()
    },
    getters: {
        getUserName(): string | null | undefined {
            if(this.userName){
                return this.userName
            }
        },
        getUserId(): string | null | undefined {
            if(this.userId){
                return this.userId
            }
        },
        isAuthentificated(): boolean{
            return !!this.getUserName
        }
    },
    actions: {
        logout(): void {
            this.userName = ''
            this.userId = ''
        }
    }
})