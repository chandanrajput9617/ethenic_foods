import { useAdminState } from '@/contexts/AdminContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UserEdit = () => {
 const [selectedOption, setSelectedOption] = useState('profileInfo');
 const [userData, setUserData] = useState({});
 const [isEditable, setIsEditable] = useState(false);
 const location = useLocation();
 const orderDetails = location.state?.detailData;
 const { setAlert } = useAdminState();


 useEffect(() => {
   if (orderDetails) {
     setUserData(orderDetails);
   }
 }, [orderDetails]);

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
       await axios.put(import.meta.env.VITE_APP_BASE_API+`/api/v1/users/update-user/${userData._id}`, {
         userData: userData,
       }, {
         headers: {
           'Authorization': `Bearer ${token}`,
         },
       });
       setAlert({ errType: "success", errMsg: "update Sucessfully", isError: true });
       history.push("/admin/users");

     } catch (error) {
       console.error('Error updating user data:', error);
     }
   }
   setIsEditable(!isEditable);
 };

 return (
   <>
     <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" />
     <div className="container">
       <div className="view-account">
         <section className="module">
           <div className="module-inner">
           <div className="content-panel" style={{borderLeft:"none"}}>
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
                              value={userData?.username}
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
              </div>
            </div>
          </section>
        </div>
      </div>
</>
    )
}

export default UserEdit