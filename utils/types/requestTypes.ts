export interface categoriesType {
    [key: string]: {
        subcategory: [{ text: string, url: string }],
        text: string
    }
}

export interface productType {
    category: string,
    description: string,
    id: string,
    image: [{
        largeURL: string,
        thumbnailURL: string
    }],
    name: string,
    price: string,
    rating: number,
    rating_votes: number
    reviews: [{
        text: string,
        date: string,
        username: string,
        userId: string
    }],
    saled: number,
    subcategory: string
}

export interface productWithId {
    [key: string] : {
        category: string,
        description: string,
        id: string,
        image: [{
            largeURL: string,
            thumbnailURL: string
        }],
        name: string,
        price: string,
        rating: number,
        rating_votes: number
        reviews: [{
            text: string,
            date: string,
            username: string,
            userId: string
        }],
        saled: number,
        subcategory: string
    }
}

export interface fieldType {
    activated: boolean,
    error: string,
    errorText: string
    pattern: RegExp,
    val: string,
    valid: boolean
}

export interface reviewsType {
    date: string,
    text: string,
    userId: string,
    username: string
}

export interface imageType {
        largeURL: string,
        thumbnailURL: string
}

export interface productInCartType {
    [key: string] : {
        id: string,
        name: string,
        price: string,
        qty: number
    }
}

export interface catType {
    cat: string
}

export interface subcatType {
    cat: string,
    subcat: string
}

export interface arrInfoType {
    label: string,
    val: string,
    pattern?: RegExp,
    valid: boolean,
    activated?: boolean,
    error?: string,
    errorText?: string
}

export interface ratingInfoType {
    ratingVote: string,
    reviewText?: string
}

export interface subcategoryType {
    url: string,
    text: string
}

export interface authType {
    userName: string,
    userId: string
}

export interface breadcrumbsArrayType {
    text: string,
    link: string
}