import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchData } from './services/Api';
import axios from 'axios';
import Noproductincart from './Noproductincart';
import "./Carttest.css"
import { loadStripe } from '@stripe/stripe-js';
import Header from './Header';
import Alert from './Alert';
import Loader from '@/components/Loader';
import { useProductState } from './context/ProductContext';
import { Footer } from './Footer';


const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [cartId, setCartId] = useState()
  const [shipingCharge, setShipingCharge] = useState({
    deliveryCharge: 0,
    tax: 0
  }

  )
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  let { setCartCount } = useProductState()
const [shipmentmsg,setShipmentmsg] = useState()
  const token = localStorage.getItem('token');
  let totalPrice;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };
  const fetchDataFromApi = async () => {
    setIsLoading(true);
    try {
      if (token) {
        const response = await axios.get(import.meta.env.VITE_APP_BASE_API + '/api/v1/products/get-cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          mode:"cors"
        });
        setCartData(response?.data?.data[0].items)
        setCartId(response?.data?.data[0]._id)
        setCartCount(response?.data?.data[0].items?.length)
        setShipingCharge({
          deliveryCharge: response?.data?.data[0].shippingCharge,
          tax: response?.data?.data[0].tax
        })
        setShipmentmsg(response?.data.data[0])
       
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false)
    }
  };
  useEffect(() => {
    fetchDataFromApi();
  }, []);

  useEffect(() => {
    countCartItems();
  }, []);
  if (token) {
    totalPrice = cartData.reduce((total, item) => total + (item?.productId?.price * item?.quantity), 0)
  } else {
    totalPrice = localData.reduce((total, item) => total + (item?.product?.price * item?.quantity), 0)
  }

  const countCartItems = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setLocalData(updatedCart);
    const itemCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
  };

  const updateQuantity = async (index, newQuantity, item, incordec) => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      try {
        const response = await axios.post(import.meta.env.VITE_APP_BASE_API + '/api/v1/products/add-to-cart', [{
          productId: item?.productId?._id,
          quantity: incordec,
        }], {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          mode :"cors"
        });
        await fetchDataFromApi();
      } catch (error) {
        console.error('Error updating quantity:', error);
      } finally {
        setIsLoading(false)
      }
    } else {
      const updatedCart = [...localData];
      updatedCart[index].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      countCartItems();
    }
  };

  const deleteProduct = async (index) => {
    if (token) {
      setIsLoading(true);
      try {
        const productId = cartData[index].productId._id;
         await axios.get(import.meta.env.VITE_APP_BASE_API + `/api/v1/products/remove-items-from-cart/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          mode:"cors"
        });
        showAlert("danger", "Product Delete Sucessfully");
        await fetchDataFromApi();
        setCartCount(prev => prev - 1);
      } catch (error) {
        console.error('Error deleting the product:', error);
      } finally {
        setIsLoading(false); 
      }
    } else {
      const updatedCart = [...localData]; 
      updatedCart.splice(index, 1);
      showAlert("danger", "Product Delete Sucessfully");
      setLocalData(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); 
      countCartItems();
    }

  };

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
    } else {
      payment()
    }

  };

  const payment = async () => {

    try {
      setIsLoading(true);
      const stripeKeyResponse = await axios.get(import.meta.env.VITE_APP_BASE_API +'/api/v1/credentials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        mode: "cors"
      });
   
      const stripePublicKey = stripeKeyResponse?.data.data.stripePublishableKey; 
      const stripe = await loadStripe(stripePublicKey);
      const response = await axios.post(import.meta.env.VITE_APP_BASE_API + `/api/v1/order/create-order/${cartId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        mode:"core"
      });
      const sessionID = response.data?.data?.sessionID;
      const result = await stripe.redirectToCheckout({
        sessionId: sessionID,
      });
      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error during payment:', error);
    } finally {
      setIsLoading(false); // Reset the loading state here
    }
  };
  // if (token) {
  //   setCartCount(cartData?.filteredData?.length)
  // } else {
  //   setCartCount(localData.length)
  // }

  return (
    <>
      {isLoading && <Loader />}
      {alert && <Alert type={alert.type} message={alert.message} />}
      <Header hideCart={true} />
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row d-flex flex-row  justify-content-center my-4">
            <style>
              {`
      #cartitmes::-webkit-scrollbar {
        display: none;
      }
    `}
            </style>
            <div id="cartitmes" className="col-md-8" style={{ maxHeight: '600px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="card ">
                <div className="card-header py-3">
                  <h5 className="mb-0">Cart items</h5>
                </div>
                <div className="card-body ">
                  {cartData?.length === 0 && localData?.length === 0 ? (
                    <Noproductincart />
                  ) : (
                    token ? (cartData?.map((item, index) => {
                      return (
                        
                        <>
                          {<div className="_1AtVbE col-12-12"  key={`cartItem-${item.productId._id}`}>
                            <div className="zab8Yh _10k93p">
                              <div className="_2nQDXZ">
                                <a href="/nb-nicky-boy-printed-men-round-neck-black-t-shirt/p/itmb1c6b5e8551de?pid=TSHGW3FNAGC9UJ7X&amp;lid=LSTTSHGW3FNAGC9UJ7XCU0GGF&amp;marketplace=FLIPKART"><span>
                                  <div className="CXW8mj" style={{ height: '112px', width: '112px' }}>
                                    <img loading="lazy" className="_396cs4" alt="productImg" src={import.meta.env.VITE_APP_BASE_API + item?.productId?.images[0]} />
                                  </div></span></a>
                                <div className="_3fSRat">
                                  <div className="_2-uG6-">
                                    <a className="_2Kn22P gBNbID" href="/nb-nicky-boy-printed-men-round-neck-black-t-shirt/p/itmb1c6b5e8551de?pid=TSHGW3FNAGC9UJ7X&amp;lid=LSTTSHGW3FNAGC9UJ7XCU0GGF&amp;marketplace=FLIPKART">{item?.productId?.title}</a>
                                  </div>
                                  <div className="_20RCA6"> {item?.productId?.short_description}</div>
                                  {/* <div className="_3ZS8sw">Seller:NIKKYBOY
                                         <img className="WC-2wP" src="//static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" />
                                   </div> */}
                                  <span className="_2-ut7f _1WpvJ7">{formatter.format(item.productId.price)}</span>
                                </div>
                              </div>
                              <div className="nZz3kj _1hNI6F">
                                <div className="_1uc2IE">
                                  <div className="_3dY_ZR">
                                    <button
                                      className="_23FHuj"
                                      disabled={item.quantity === 1}
                                      onClick={() => updateQuantity(index, item.quantity - 1, item, -1)}
                                    >
                                      –
                                    </button>
                                    <div className="_26HdzL">
                                      <input type="text" className="_253qQJ" id={`form${index}`}
                                        min="0"
                                        name="quantity"
                                        value={item?.quantity}
                                        onChange={(e) => updateQuantity(index, e.target.value)} />
                                    </div>
                                    <button className="_23FHuj" onClick={() => updateQuantity(index, item.quantity + 1, item, 1)}
                                    > + </button>
                                  </div>
                                </div>
                                <div className="_10vWcL td-FUv WDiNrH" onClick={() => deleteProduct(index)}
                                >
                                  <div className="_3dsJAO"
                                  >Remove</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          }
                        </>
                      )
                    }
                    )
                    ) : (localData.map((item, index) => {
                      return (
                        <>
                          {<div className="_1AtVbE col-12-12" key={index}>
                            <div className="zab8Yh _10k93p">
                              <div className="_2nQDXZ">
                                <a href="/nb-nicky-boy-printed-men-round-neck-black-t-shirt/p/itmb1c6b5e8551de?pid=TSHGW3FNAGC9UJ7X&amp;lid=LSTTSHGW3FNAGC9UJ7XCU0GGF&amp;marketplace=FLIPKART"><span>
                                  <div className="CXW8mj" style={{ height: '112px', width: '112px' }}>
                                    <img loading="lazy" className="_396cs4" alt="productImg" src={import.meta.env.VITE_APP_BASE_API + item?.product?.images[0]} />
                                  </div></span></a>
                                <div className="_3fSRat">
                                  <div className="_2-uG6-">
                                    <a className="_2Kn22P gBNbID" href="/nb-nicky-boy-printed-men-round-neck-black-t-shirt/p/itmb1c6b5e8551de?pid=TSHGW3FNAGC9UJ7X&amp;lid=LSTTSHGW3FNAGC9UJ7XCU0GGF&amp;marketplace=FLIPKART">{item?.product?.title}</a>
                                  </div>
                                  <div className="_20RCA6"> {item?.product?.short_description}</div>
                                  {/* <div className="_3ZS8sw">Seller:NIKKYBOY
                                         <img className="WC-2wP" src="//static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" />
                                   </div> */}
                                  <span className="_2-ut7f _1WpvJ7">{formatter.format(item?.product?.price * item.quantity)}</span>
                                </div>
                              </div>
                              <div className="nZz3kj _1hNI6F">
                                <div className="_1uc2IE">
                                  <div className="_3dY_ZR">
                                    <button
                                      className="_23FHuj"
                                      disabled={item.quantity === 1}
                                      onClick={() => updateQuantity(index, item.quantity - 1)}
                                    >
                                      –
                                    </button>
                                    <div className="_26HdzL">
                                      <input
                                        id={`form${index}`}
                                        min="0"
                                        name="quantity"
                                        value={item.quantity}
                                        type="number"
                                        className="_253qQJ" onChange={(e) => updateQuantity(index, e.target.value)}
                                      />
                                    </div>
                                    <button className="_23FHuj" onClick={() => updateQuantity(index, item.quantity + 1)}
                                    > + </button>
                                  </div>
                                </div>
                                <div className="_10vWcL td-FUv WDiNrH">
                                  <div className="_3dsJAO" onClick={() => deleteProduct(index)}
                                  >Remove</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          }
                        </>
                      )
                    }))
                  )
                  }
                </div>
              </div>
              <div>
                
              </div>
              {(cartData?.length > 0 || localData.length > 0) && (
                <div className="card mb-4">
                  <div className="card-body text-right">
                    <button type="button" className="btn btn-primary" onClick={() => handleCheckout()}>
                      Go to checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              
            </div>
            {cartData?.length === 0 && localData?.length === 0 ? (
              <></>
            ) : (
              <>
                <div id="pricedetails" className="col-md-4" style={{ position: "sticky", top: "0" }}>
                  <div className="card mb-4">
                    <div className="card-header py-3">
                      <h5 className="mb-0">Price Details</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li
                          className="list-group-item d-flex justify-content-between flex-row border-0 px-0 pb-0">
                          <div>
                            Price
                          </div>
                          <div>
                            {totalPrice}
                          </div>
                        </li>
                        <li className="list-group-item d-flex justify-content-between flex-row  px-0">
                          <div>
                            Delivery Charges
                          </div>
                          <div>
                            {shipingCharge?.deliveryCharge}
                          </div>

                        </li>
                        <li className="list-group-item d-flex justify-content-between flex-row  px-0">
                          <div>
                            Tax
                          </div>
                          <div>
                            {shipingCharge?.tax}
                          </div>

                        </li>
                        <li
                          className="list-group-item d-flex justify-content-between flex-row border-0 px-0 mb-3">
                          <div>
                            <strong>Total amount</strong>
                          </div>
                          <div>
                            <span><strong>${(totalPrice + shipingCharge?.deliveryCharge + shipingCharge?.tax)}</strong></span>
                          </div>
                        </li>
                      </ul>
                      {shipmentmsg?.shipment_delivery_message && <div>Delivered in {shipmentmsg?.shipment_delivery_message}</div>}

                    </div>
                  </div>
                </div>
              </>
            )
            }     </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Cart;
