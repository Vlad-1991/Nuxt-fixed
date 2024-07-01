/* in this store saved all states of UI elements */
export const useUiStore = defineStore("UiStore", {
    state: (): UiState => {
            return {
                showBestsellers: false,
                cat: '',
                subcat: '',
                categories: [] as string[],
                checkboxBestSeller: false,
                sidebar: '-500px',
                errorMessage: '',
                breadcrumbsArray: [] as breadcrumbsArrayType[]
        }
    },
    getters: {
        /* logic - show or hide bestseller checkbox on left sidebar */
        getShowBestsellers(): boolean {
                return this.showBestsellers
        },
        /* return list of all categories and subcategories */
        getAllCategories(): string[] | never[] {
            return this.categories
        },
        /* return value of bestseller checkbox */
        getCheckboxBestSeller(): boolean {
            return this.checkboxBestSeller
        },
        /* return value of current category */
        getCategory(): string {
            return this.cat
        },
        /* return value of current subcategory */
        getSubcategory(): string {
            return this.subcat
        },
        /* return state of left style property of sidebar in px */
        getSideBarStatus(): string {
            return this.sidebar
        },
        /* return current error message */
        getErrorMessage(): string {
            return this.errorMessage
        },
        /* get breadcrumbs array to render in breadcrumbs component */
        getBreadcrumbs(): breadcrumbsArrayType[] {

            if(this.breadcrumbsArray){
                return this.breadcrumbsArray
            }else {
                return []
            }
        }
    },
    actions: {
        /* toggle state of bestseller showing */
        changeShowBestsellers(): void {
            this.showBestsellers = !this.showBestsellers
        },
        /* to save info about current category and subcategory in Store */
        writeCategoryInfo(categoryInfo: {cat: string, subcat: string }): void{
            this.cat = categoryInfo.cat
            this.subcat = categoryInfo.subcat
        },
        /* to save all categories and subcategories list in Store */
        pushCategories(categories: []): void{
            this.categories = categories
        },
        /* to change state of left property of sidebar */
        toggleSidebar(): void{
            if(this.sidebar === "-500px"){
                this.sidebar = "0";
            }else{
                this.sidebar = "-500px"
            }
        },
        /* set new value of breadcrumbs array, from current route */
        setBreadcrumbs(arr: breadcrumbsArrayType[]): void{

            this.breadcrumbsArray = arr
        },
        /* to save error.message from server response to Store */
        setErrorMessage(e: string): void {
            this.errorMessage = e
        }
    }
})