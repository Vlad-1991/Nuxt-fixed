import {getAuth, signInWithPopup, OAuthProvider, FacebookAuthProvider, GoogleAuthProvider} from "firebase/auth"
import {initializeApp} from "firebase/app"
import {firebaseConfig} from '~/firebaseConfig'
import {createUser, load} from "~/services/api/requests";

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)


/* to login with facebook credentials */
export const loginWithFacebook = async (): Promise<void> => {
    let accessToken = ''
    let email = null
    const provider = new FacebookAuthProvider()
    await signInWithPopup(auth, provider)
        .then((result): void => {
            accessToken = result.user.accessToken
            email = result.user.email
            setUserInfo(result.user)
        })
        .catch((error) => {
            console.error("Error during sign in", error.message)
        })
}

/* to login with google credentials */
export const loginWithGoogle = async (): Promise<void> => {
    let accessToken = ''
    let email = null
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider).then((result): void => {
        accessToken = result.user.accessToken
        email = result.user.email
        setUserInfo(result.user)
    })
        .catch((error) => {
            console.error("Error during sign in", error.message)
        })

}

export const loginWithApple = async (): Promise<void> => {
    let accessToken = ''
    let email = null
    const appleProvider = new OAuthProvider('apple.com')
    await signInWithPopup(auth, appleProvider).then((result): void => {
        accessToken = result.user.accessToken
        email = result.user.email
        setUserInfo(result.user)
    })
        .catch((error) => {
            console.error("Error during sign in", error.message)
        })
}


    /* if logged in by social media - set user info from firebase (if exists) or create new user on firebase with Name and Email */
    const setUserInfo = async (userInfo: any): Promise<void> => {
        const AuthStore = useAuthStore()
        const router = useRouter()

        AuthStore.setToken(userInfo.accessToken)
        if (userInfo.email) {


            let userData = await load(VUE_APP_FB_URL + `/users/${encode(userInfo.email)}.json?auth=${userInfo.accessToken}`)
            if (userData) {
                await AuthStore.setUserInfo(userData)
            } else {
                try {

                    let authData = {
                        email: userInfo.email ? userInfo.email : '',
                        name: userInfo.displayName ? userInfo.displayName : '',
                        country: '',
                        address: '',
                        zip: '',
                        phone: userInfo.phoneNumber ? userInfo.phoneNumber : '',
                        password: '',
                        promo: {"code": '', "discount": null, "value": ''}
                    }

                    const userCreated = await createUser(VUE_APP_FB_URL + `/users/${encode(authData.email)}.json?auth=${userInfo.accessToken}`, authData)
                } catch (e: string | unknown) {
                    if (e) {
                        console.log(e.message)
                    }
                }
            }

        }
        await router.push({name: 'index'})
    }