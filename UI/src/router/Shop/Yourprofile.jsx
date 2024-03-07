import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Header from './Header';
import { Footer } from './Footer';
import { useHistory } from 'react-router-dom';
import "./Yourprofile.css"
import Loader from '@/components/Loader';


const Yourprofile = () => {
  const [selectedOption, setSelectedOption] = useState('profileInfo');
  const [userData, setUserData] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const history = useHistory();
  const handleClick = (item) => {
    history.push({
      pathname: '/userorderdetail',
      state: { orderDetails: item }
    });
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  }
  const handleInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateClick = async () => {
    if (isEditable) {
      const token = localStorage.getItem("token");
      try {

        await axios.put(import.meta.env.VITE_APP_BASE_API + `/api/v1/users/update-user/${userData._id}`, {
          userData: userData,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
    setIsEditable(!isEditable);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true); // Start loading
    axios.get(import.meta.env.VITE_APP_BASE_API + "/api/v1/users/get-current", {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      mode: 'cors'
    })
      .then(response => {
        setUserData(response?.data?.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axios.get(import.meta.env.VITE_APP_BASE_API + '/api/v1/users/get-user-order-history', {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      mode: 'cors'
    })
      .then(response => {
        setOrderHistory(response?.data?.data);
      })
      .catch(error => {
        console.error('Error fetching order history: ', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      <Header />
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" />
      <div className="container">
        <div className="view-account">
          <section className="module">
            <div className="module-inner">
              <div className="side-bar">
                {/* <div className="user-info">
                  <img className="img-profile img-circle img-responsive center-block" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
                  <ul className="meta list list-unstyled">
                    <li className="name">Rebecca Sanders
                      <label className="label label-info">UX Designer</label>
                    </li>
                  </ul>
                </div> */}
                <nav className="side-menu">
                  <ul className="nav">
                    <li className={selectedOption === 'profileInfo' ? 'active' : ''} onClick={() => handleOptionClick('profileInfo')}><a href="#/"><span className="fa fa-user"></span> Profile</a></li>
                    <li className={selectedOption === 'orders' ? 'active' : ''} onClick={() => handleOptionClick('orders')}><a href="#/"><span className="fa fa-cog"></span>Your Orders</a></li>
                  </ul>
                </nav>
              </div>
              <div className="content-panel">
                {selectedOption === 'profileInfo' && (
                  <>
                    <h2 className="title">Profile</h2>
                    <form className="form-horizontal">
                      <fieldset className="fieldset">
                        <h3 className="fieldset-title">Personal Info</h3>
                        <div className="form-group">
                          <label className="col-md-2 col-sm-3 col-xs-12 control-label">User Name</label>
                          <div className="col-md-10 col-sm-9 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              name="username"
                              value={userData.username}
                              readOnly={!isEditable}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className="fieldset">
                        <h3 className="fieldset-title">Contact Info</h3>
                        <div className="form-group">
                          <label className="col-md-2  col-sm-3 col-xs-12 control-label">Email</label>
                          <div className="col-md-10 col-sm-9 col-xs-12">
                            <input

                              type="email"
                              className="form-control"
                              name="email"
                              value={userData.email}
                              readOnly={!isEditable}
                              onChange={handleInputChange} />
                            <p className="help-block">This is the email </p>
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className="fieldset">
                        <h3 className="fieldset-title">Address Info</h3>
                        <div className="form-group">
                          <label className="col-md-2  col-sm-3 col-xs-12 control-label">Address</label>
                          <div className="col-md-10 col-sm-9 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={userData.address}
                              readOnly={!isEditable}
                              onChange={handleInputChange}

                            />
                            <p className="help-block">This is the address </p>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-md-2  col-sm-3 col-xs-12 control-label">Country</label>
                          <div className="col-md-10 col-sm-9 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              name="country"
                              value={userData.country}
                              readOnly={!isEditable}
                              onChange={handleInputChange}
                            />
                            <p className="help-block"></p>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-md-2  col-sm-3 col-xs-12 control-label">City</label>
                          <div className="col-md-10 col-sm-9 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                              readOnly={!isEditable}
                              onChange={handleInputChange}
                              value={userData.city}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-md-2  col-sm-3 col-xs-12 control-label">State</label>
                          <div className="col-md-10 col-sm-9 col-xs-12">
                            <input type="text" className="form-control" value={userData.state} readOnly={!isEditable} name="state" onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-md-2  col-sm-3 col-xs-12 control-label">Zip code</label>
                          <div className="col-md-10 col-sm-9 col-xs-12">
                            <input type="number" className="form-control" value={userData.zipcode} readOnly={!isEditable}
                              onChange={handleInputChange}
                              name="zipcode"
                            />
                          </div>
                        </div>
                      </fieldset>
                      <div className="form-group">
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <button type="button" className="btn btn-primary" onClick={handleUpdateClick}>
                            {isEditable ? 'Update' : 'Edit'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}
                {selectedOption === 'orders' && (
                  <>
                    {

                      orderHistory?.length > 0 ? (
                        orderHistory?.map((item) => {
                          return (
                            <>
                              <div className="row product" onClick={() => handleClick(item)} style={{cursor:"pointer"}}>
                                <div className="col-md-2">
                                  <img alt="Sample Image" style={{ maxHeight: "75px", width: "auto" }} src={import.meta.env.VITE_APP_BASE_API + `${item?.productDetails[0]?.images[0]}`} />
                                </div>
                                <div className="col-md-6 product-detail" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                  <div>
                                    {
                                      item?.productDetails[0]?.title
                                    }
                                  </div>
                                  <div>
                                    items ({item?.productDetails?.length})
                                  </div>
                                </div>
                                <div className="col-md-4 product-detail" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                  {item?.orderDetails?.status === 'pending' ? (
                                    <div className='reddot' style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#dc3545', border: '2px solid #dc3545', display: 'inline-block', marginRight: '8px' }}></div>

                                  ) : (
                                    <div className='greendot' style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#26a541', border: '2px solid #26a541', display: 'inline-block', marginRight: '8px' }}></div>

                                  )}
                                  <div>
                                    {item?.orderDetails?.status}
                                  </div>
                                </div>
                              </div>
                            </>
                          )

                        }
                        )
                      ) : (
                        <div>There are no orders present.</div>
                      )
                    }
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Yourprofile





