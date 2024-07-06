import requestAxios from "~/services/api/index";

export async function load(url: string): Promise<any>{
        const {data} = await requestAxios.get(url)
        return data
}

export async function updateUser(url: string, userData: userDataType): Promise<any>{
    const data = await requestAxios.put(url, userData)
    return data
}

export async function createUser(url: string, userData: userDataType): Promise<any>{
    const data = await requestAxios.put(url, userData)
    return data
}


export async function addOrder(url: string, order: { [key: string]: (string | boolean | {}) }): Promise<any>{
    const data = await requestAxios.post(url, order)
    return data
}

export async function loadOrdersById(){
     const {data} = await requestAxios.get(ORDERS_DATABASE)
    return data
}

export async function updateInDatabase(url: string, updatedObject: {}): Promise<void>{
    await requestAxios.put(url, updatedObject)
}

