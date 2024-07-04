import {load} from "~/services/api/requests";

export async function loadCategoriesToStore () {
   const UiStore = useUiStore()
    try {
        const response = await load(CATEGORIES_DATABASE)
        if(response){
            response.sort((a: categoriesType, b: categoriesType) => Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1)
            UiStore.pushCategories(response)
        }

    }catch (e) {
        UiStore.setErrorMessage(e.message)
    }
}