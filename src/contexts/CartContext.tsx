import { createContext, ReactNode, useState  } from 'react'
import { ProductProps } from './../@/types/Product'

interface CartContextData {
  cart: CartProps[];
  cartAmount: number;
  addItemCart: (newItem: ProductProps) => void; // eslint-disable-line
  removeItemCart: (product: CartProps) => void; // eslint-disable-line no-unused-vars
  total: string;
}

interface CartProps{
  id: number;
  title: string;
  description: string;
  price: number;
  cover: string;
  amount: number;
  total: number;
}

interface CartProviderProps{
  children: ReactNode;
}

const CartContext = createContext({} as CartContextData)

export default  function CartProvider({ children }: CartProviderProps){
  const [cart, setCart] = useState<CartProps[]>([])
  const [total, setTotal] = useState("");

  function addItemCart(newItem: ProductProps){
    const indexItem = cart.findIndex(item => item.id === newItem.id)

    if(indexItem !== -1){
      const cartList = [...cart];
      cartList[indexItem] = {
        ...cartList[indexItem],
        amount: cartList[indexItem].amount + 1,
        total: (cartList[indexItem].amount + 1) * cartList[indexItem].price
      };

      setCart(cartList);
      totalResultCart(cartList);
      return;
    }

    // Adicionar esse item na nossa lista.
    const data = {
      ...newItem,
      amount: 1,
      total: newItem.price
    }


    setCart(products => [...products, data])
    totalResultCart([...cart, data])

  }


  function removeItemCart(product: CartProps){
    const indexItem = cart.findIndex(item => item.id === product.id)

    if(cart[indexItem]?.amount > 1){
    const cartList = cart;

    cartList[indexItem].amount = cartList[indexItem].amount -1;
    cartList[indexItem].total = cartList[indexItem].total - cartList[indexItem].price;
    
    setCart(cartList);
    totalResultCart(cartList)
    return;
    }

    const removeItem = cart.filter(item => item.id !== product.id)
    setCart(removeItem);
    totalResultCart(removeItem)

  }


  function totalResultCart(items: CartProps[]){
    const myCart = items;
    const result = myCart.reduce((acc, obj) => { return acc + obj.total}, 0)
    const resultFormated = result.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    setTotal(resultFormated);
  }


  return(
    <CartContext.Provider 
      value={{ 
        cart,
        cartAmount: cart.length,
        addItemCart,
        removeItemCart,
        total
       }}
    >
      {children} 
    </CartContext.Provider>
  )
}

export { CartContext };

