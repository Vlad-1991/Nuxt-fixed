export const useCartStore = defineStore("CartStore", {
    state: (): CartState => {
        return {
            cart: {}
        }
    },
    getters: {
        getCartProducts(): productInCartType | null {
            return this.cart
        },
        getProductById: (state) => {
            return (id: string) => state.cart[id]
        },
        /* return count of products in cart, can be used in navbar */
        getCartCount(): number{
            let count: number = 0
            for (let product in this.cart) {
                count += this.cart[product].qty
            }
            return count
        },
        /* calculate summary of all products price, multiplied on product qty in cart */
        getSummary(): number{
            let sum: number = 0
            for(let product in this.cart){
                sum += this.cart[product].qty * parseFloat(this.cart[product].price)
            }
            return sum
        }
    },
    actions: {
        /* add to store product, added to cart, and add this product to local storage
        if qty > 100 nothing will be added, this is limit per order of logic this online store */
        addToCart(product: productWithId, qty: number): string {

           let prod = product
            let key = prod.id
            let cur_product = this.getProductById(key)
            let prod_in_cart: productInCartType = {}

            if (cur_product && (cur_product.qty >= 100)) {
                return 'overloaded'
            } else {
                prod_in_cart[key] = {
                    id: prod.id,
                    qty: qty,
                    name: prod.name,
                    price: prod.price
                }

                let cart_key = prod_in_cart[prod.id].id;

                if (this.cart[cart_key]) {

                    this.cart[cart_key].qty += prod_in_cart[prod.id].qty

                    if (this.cart[cart_key].qty > 100) {
                        this.cart[cart_key].qty = 100
                    }
                } else {
                    this.cart[cart_key] = prod_in_cart[prod.id];
                }

                localStorage.setItem("cart", JSON.stringify(this.cart))
                return 'success'
            }
        },
        /* update count of product in cart with validation 1-100 items can be in cart */
        updateCount(payload: {id: string, cnt: number}): void{
            let cnt: number = payload.cnt
            if(cnt <= 1) {
                cnt = 1
            }else if(cnt >= 100){
                cnt = 100
            }
            this.cart[payload.id].qty = cnt
            localStorage.setItem("cart", JSON.stringify(this.cart))
        },
        /* delete selected product from cart and local storage */
        deleteProduct(id: string): void{
            delete this.cart[id]

            localStorage.setItem("cart", JSON.stringify(this.cart))
        },
        /* get all products from local storage to Cart Store, this function will call one time, when user open website */
        async getCart(): Promise<void>{
            let cart

             const cartItem: string | null = localStorage.getItem("cart");

            if (cartItem) {
                cart = JSON.parse(cartItem);
            }

            if(cart){
                this.cart = cart
            }else{
                this.cart = {}
            }
        },
        /* remove all products from cart and local storage, method will call once, when user will confirm order */
        clearCart(): void{
            this.cart = {}
            localStorage.removeItem("cart")
        }
    }
})