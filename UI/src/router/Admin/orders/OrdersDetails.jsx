import React from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const OrdersDetails = () => {
  const location = useLocation();
  const orderDetails = location?.state?.detailData;
  let subtotalofproduct = orderDetails.products.reduce((total, item) => total + item.price, 0);

  return (
    <>
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="row">
          <div className="col-12">
            <div className="card mb-3">
              <div className='d-flex flex-row justify-content-between p-3'>
                <div>
                  Ordered on  {new Date(orderDetails?.orderDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <div>
                  Order# {orderDetails?._id
                  }
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
                        <li>{orderDetails?.userDetails?.username}</li>
                        {/* <li>Anand nagar</li> */}
                        <li>{orderDetails?.userDetails?.address}</li>
                        <li>{orderDetails?.userDetails?.city}, {orderDetails?.userDetails?.zipcode}</li>
                        <li>{orderDetails?.userDetails?.state}</li>
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
                      <div>${orderDetails?.shippingCharge}</div>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                      <div>Tax:</div>
                      <div>${orderDetails?.tax}</div>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                      <strong>Grand Total:</strong>
                      <strong>
                        <div>${orderDetails?.subTotal}</div>
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          orderDetails?.products?.map((item) => {
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
                          <Link to={`/productdetail/${item._id}`} style={{ color: "#007185" }}>{item?.title}</Link>
                        </div>
                        <div>
                          price : ${item?.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })
        }
      </div>
    </>
  )
}

export default OrdersDetails