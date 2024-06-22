/* to filter products according to search query, if search query isnt exist - load all products */
import type {Ref} from "vue"
import {ref} from "vue";
import type {productWithId} from "@/utils/types/requestTypes";

export const filterSearchedProducts = (query: string, searchQuery: Ref<string>, products: Ref<productWithId[]>,
                                       searchQueryProducts: Ref<productWithId[]>): void => {

    searchQuery.value = query

    const filteredByName = ref()
    const filteredByDescription = ref()


    filteredByName.value = products.value.filter((product: productWithId): productWithId => {
        if(searchQuery.value){
            // @ts-ignore
            return (product[Object.keys(product)].name.toLowerCase()).includes(searchQuery.value.toLowerCase())
        }
        return product
    })

    filteredByDescription.value = products.value.filter((product: productWithId): productWithId => {
        if(searchQuery.value){
            // @ts-ignore
            return (product[Object.keys(product)].description.toLowerCase()).includes(searchQuery.value.toLowerCase())
        }
        return product
    })

    searchQueryProducts.value = Array.from(new Set(filteredByName.value.concat(filteredByDescription.value)))
}