import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from '@/router/Shop/Alert';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ResetPassword = () => {
  const { token } = useParams();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    },  5000);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_APP_BASE_API +'/api/v1/users/reset-password', {
        newPassword: password,
        confirmPassword: confirmPassword,
        token: token
      });
      showAlert("success", "password reset successfully");
      setTimeout(() => {
        history.push('/'); 
      },  1000);
    } catch (error) {
      setError('Error resetting password. Please try again.');
    }
  };

  

  return (
    <>
    {alert && <Alert type={alert.type} message={alert.message} />}
    <form autoComplete="off" id="form_submit" className="row g-3 mx-auto p-2" style={{ width: "650px" }} onSubmit={handleResetPassword}>
      <div className="container border border-1 p-4" style={{ marginTop: "100px" }}>
        <div className="row">
          <div className="col-md-10">
            <h1 id="h1" className="text-center">Password</h1>
          </div>
          <div className="col-md-10">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input type="password" className="form-control" id="inputPassword" name="inputPassword" value={password} onChange={handlePasswordChange} required />
          </div>
          <div className="col-md-10">
            <label htmlFor="inputConfirmPassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="inputConfirmPassword" name="inputConfirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          </div>
          <div className="col-10 mt-5 form_action--button">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </form>
    </>
  );
};

export default ResetPassword;
