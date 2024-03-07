import axios from "axios";
import DOMPurify from "dompurify";
import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductContexts = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertmsg, setAlertMsg] = useState()
  const [showcard, setShowCard] = useState(false)
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [show360Modal, setShow360Modal] = useState(null);
  const [productId, setProductId] = useState(null)
  const [showsocial, setShowSocial] = useState(null)
  const [showvideomodal, setShowvideomodal] = useState(null);
  const [videodata, setVideoData] = useState()
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0)
  const [allproductLoader,setallproductLoader] = useState()
  const [productload,setProductLoad] = useState()

  const handleaddtocard = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setProductLoad(true)
        const response = await axios.get(import.meta.env.VITE_APP_BASE_API +'/api/v1/products/get-cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          mode: 'cors'
        });
        const cartItems = response?.data?.data[0]?.items;
        const isItemInCart = cartItems?.some(cartItem => cartItem?.productId._id === item.product._id);
        if (isItemInCart) {
          setAlertMsg('Item is already in the cart');
          setShowAlert(true);
          setTimeout(() => {
            setAlertMsg("");
            setShowAlert(false);
          }, 3000);
          setProductLoad(false)
        } else {
          setAlertMsg("Product added to the cart");
          const response = await axios.post(import.meta.env.VITE_APP_BASE_API +'/api/v1/products/add-to-cart', [{
            productId: item.product._id,
            quantity: 1,
          }], {
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            mode: 'cors'
          });
          setCartCount(prevCount => prevCount + 1);
          setShowAlert(true);
          setTimeout(() => {
            setAlertMsg("");
            setShowAlert(false);
          }, 3000);
          setProductLoad(false)

        }
      } else {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const isItemInCart = existingCart.some((cartItem) => cartItem?.product?._id === item?.product?._id);
        if (!isItemInCart) {
          const newCart = [...existingCart, item];
          setCartCount(prevCount => prevCount + 1);
          localStorage.setItem('cart', JSON.stringify(newCart));
          setCart(newCart);
          setShowCard(true);
          setAlertMsg("Product added to the cart")
          setShowAlert(true);
          setTimeout(() => {
            setAlertMsg("")
            setShowAlert(false);
          }, 3000);
        } else {
          setAlertMsg('Item is already in the cart');
          setShowAlert(true)
          setTimeout(() => {
            setAlertMsg("")
            setShowAlert(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error handling add to cart:', error);
    }
  };
  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  const handleExploreClicks = (item) => {
    setShow360Modal(true);
    setSelectedItem(item);
   
  };
  const handleSocialmedia = (item) => {
    setProductId(item.product._id)
    setShowSocial(true);
  };
  const handleVideomodal = (item) => {
    setVideoData(item.product);
    setShowvideomodal(true);
  };
console.log(show360Modal,"contextvala showw");
  return (
    <ProductContext.Provider
      value={{
        setallproductLoader,allproductLoader, setCartCount,productload,setProductLoad,
        cartCount, setLoading, loading, handleaddtocard, showAlert, setShowAlert, alertmsg, setAlertMsg, showcard, setShowCard, cart, setCart, createMarkup, handleExploreClicks, handleSocialmedia, handleVideomodal, setSelectedItem, selectedItem, setShow360Modal, show360Modal, setProductId, productId, setShowSocial, showsocial, setVideoData, videodata, showvideomodal, setShowvideomodal
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductState = () => useContext(ProductContext);
