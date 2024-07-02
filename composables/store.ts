import {load} from "~/services/api/requests";

export async function loadCategoriesToStore () {
   const UiStore = useUiStore()
    try {
        const {data} = await useAsyncData('Categories', () => load(CATEGORIES_DATABASE))
        let response = data.value

        if(response){
            response.sort((a: categoriesType, b: categoriesType) => Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1)
            console.log(response)
            UiStore.pushCategories(response)
        }

    }catch (e) {
        UiStore.setErrorMessage(e.message)
    }
}