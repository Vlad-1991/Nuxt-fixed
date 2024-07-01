export type CartState = { cart: productInCartType }

export interface authType {
    userName: string,
    token: string | null,
    country: string,
    adress: string,
    phone: string,
    orders: [],
    promo: {},
    email: string,
    zip: string
}

export interface UiState {
    showBestsellers: boolean,
    cat: string,
    subcat: string,
    categories: string[],
    checkboxBestSeller: boolean,
    sidebar: string,
    errorMessage: string,
    breadcrumbsArray: breadcrumbsArrayType[]
}