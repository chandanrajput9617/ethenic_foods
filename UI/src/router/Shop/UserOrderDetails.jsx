import React, { useState } from 'react';
import './UserOrderDetails.css'; // Make sure to import your CSS file
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { Footer } from './Footer';
import { Link } from 'react-router-dom';
import ReviewModal from './ReviewModal';



const UserOrderDetails = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {};
  const [reviewmodal,setReviewModal] = useState(false)
  const [productId,setroductId] = useState()

  let subtotalofproduct = orderDetails.productDetails.reduce((total, item) => total + item.price, 0);
  const handlereviewmodal = (item) => {
    setReviewModal(true);
    setroductId(item._id)
  };
  return (
    <>
      <Header />
      <ReviewModal reviewmodal={reviewmodal} setReviewModal={setReviewModal} productId={productId}/>
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="row">
          <div className="col-12">
            <div className="card mb-3">
              <div className='d-flex flex-row justify-content-between p-3'>
                <div>
                  Ordered on  {new Date(orderDetails?.orderDetails.orderDate).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}

                </div>
                <div>
                  Order# {orderDetails?.orderId}
                </div>
              </div>
              <div className="card-header">
                Order Details
              </div>
              <div className="card-body">
                <div className="row ">
                  <div className="col-md-5 mt-3">
                    <div className="d-flex ">
                      <ul className="list-unstyled mb-0">
                        <strong>Shipping Address:</strong>
                        <li>{orderDetails?.userData?.username}</li>
                        {/* <li>Anand nagar</li> */}
                        <li>{orderDetails?.userData?.address}</li>
                        <li>{orderDetails?.userData?.city}, {orderDetails?.userData?.zipcode}</li>
                        <li>{orderDetails?.userData?.state}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-2 mt-3">
                    <div className="d-flex flex-column">
                      <div>
                        <strong>
                          Payment Method:

                        </strong>
                      </div>
                      <div>
                        Pay on Delivery
                      </div>
                    </div>
                  </div>
                  <div className='col-md-5 d-flex flex-column mt-3'>
                    <div>
                      <strong>
                        order summary
                      </strong>
                    </div>
                    <div className=" d-flex flex-row justify-content-between">
                      <div>Item(s) Subtotal:</div>
                      <div>${subtotalofproduct}</div>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                      <div>Shipping:</div>
                      <div>${orderDetails?.orderDetails?.shippingCharge}</div>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                      <div>Tax:</div>
                      <div>${orderDetails?.orderDetails?.tax}</div>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                      <strong>Grand Total:</strong>
                      <strong>    
                        <div>${orderDetails?.orderDetails.subTotal}</div>
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          orderDetails?.productDetails?.map((item) => {
            return (
              <>
                <div className='col-md-12 mt-3' style={{ display: 'block', borderRadius: '8px', backgroundColor: '#fff', border: '1px #D5D9D9 solid' }}>
                  <div className="row orderproduct">
                    <div className="col-md-9" style={{ display: "flex", gap: "50px", flexDirection: "row" }}>
                      <div>
                        <img alt="Sample Image" style={{ maxHeight: "75px", width: "auto" }} src={"/api" + `${item?.images[0]}`} />

                      </div>
                      <div>
                        <div>
                        <Link to={`/productdetail/${item._id}`} style={{color: "#007185"}}>{item?.title}</Link>
                        </div>
                        <div>
                          price : ${item?.price}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 product-detail" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <div>
                        <button type="button" className="btn btn-light" onClick={()=>handlereviewmodal(item)}  
                         data-toggle="modal"
                         data-target="#reviewmodalmodal"
                         style={{ cursor: 'pointer' }}
                        >Give review</button>
                      </div>
                    </div>
                  </div>
                </div>

              </>
            )
          })
        }


      </div>
      <Footer />
    </>
  );
};

export default UserOrderDetails;