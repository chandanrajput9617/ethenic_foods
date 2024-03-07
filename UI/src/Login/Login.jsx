import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import { Link, useHistory } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Header from "@/router/Shop/Header";
import { Footer } from "@/router/Shop/Footer";
import Alert from "@/router/Shop/Alert";
import Loader from "@/components/Loader";
import { getshowingdata } from "@/router/Shop/services/Api";

const initialValues = {
  email: "",
  password: "",
};

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [image, setImage] = useState();
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    },  5000);
  };

  const handleForgotPassword = async (email) => {
    if (!email) {
      showAlert("danger", "Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_APP_BASE_API+'/api/v1/users/forgot-password', {
        email: email,
      });
      showAlert("success", "Please check your email");
      resetForm(); // Reset the form fields here
    } catch (error) {
      showAlert("danger", error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const response = await axios.post(import.meta.env.VITE_APP_BASE_API + '/api/v1/users/login', {
          userData: {
            email: values.email,
            password: values.password,
          },
        });
        const authToken = response.data.data;
        localStorage.setItem('token', authToken);
        const decodedToken = jwtDecode(authToken);
        const userType = decodedToken.role;
        const cart = JSON.parse(localStorage.getItem('cart'));
        if (cart && cart.length >  0) {
          const data = cart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity ||  1,
          }));
          const token = localStorage.getItem('token');
          const response = await axios.post(import.meta.env.VITE_APP_BASE_API + '/api/v1/products/add-to-cart',
            data, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          localStorage.removeItem('cart');
        } else {
          console.log('No items in cart.');
        }
        if (userType === 'user') {
          showAlert("success", "Login successfully");
          setTimeout(() => {
            history.push('/');
          },  1000);
        } else if (userType === 'admin') {
          history.push('/admin');
        } else {
          console.error('Invalid user type:', userType);
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        showAlert("danger", error.response.data.error);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchDataFromApi()
  }, []);

  const fetchDataFromApi = async () => {
    try {
      const result = await getshowingdata("views/get-views");
      setImage(result.data[0]?.loginBackgoundImg);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (

    <>
      {loading && <Loader />}
      <div>
        {alert && <Alert type={alert.type} message={alert.message} />}
        <Header hidebutton={true} />
        <section className="p-5 w-100" style={{ backgroundColor: "#eee", borderRadius: ".5rem .5rem  0  0" }}>
          <div className="row">
            <div className="col-12">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      {!showForgotPasswordForm ? (
                        <>
                          <p className="text-center h1 fw-bold mb-5 mt-4">Login</p>
                          <form onSubmit={handleSubmit}>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>
                            <input
                              id="email"
                              name="email"
                              className="form-control"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.email && touched.email ? (
                              <small className="text-danger mt-1">
                                {errors.email}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="password" className="form-label">
                              Password
                            </label>
                            <input
                              id="password"
                              name="password"
                              className="form-control"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type={showPassword ? "text" : "password"}
                            />
                            {errors.password && touched.password ? (
                              <small className="text-danger mt-1">
                                {errors.password}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="showPasswordCheckbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                          />
                          <label className="form-check-label" htmlFor="showPasswordCheckbox">
                            Show password
                          </label>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-right actionButtons">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={resetForm}
                              disabled={loading}
                            >
                              Clear
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleSubmit}
                              disabled={loading}
                            >
                              {loading ? 'Logging in...' : 'Login'}
                            </Button>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <br />
                          <div className="col text-right">
                            Create your account? <Link to="/register">Sign up</Link>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <br />
                          <div className="col text-right">
                          Forgot your password? <a href="#" onClick={() => setShowForgotPasswordForm(true)}>Click here</a>
                          </div>
                        </div>
                      </form>
                          
                        </>
                      ) : (
                        <div>
                          <h2>Forgot Password</h2>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleForgotPassword(values.email);
                          }}>
                            <div className="form-group">
                              <label htmlFor="email">Email Address</label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                value={values.email}
                                onChange={handleChange}
                              />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                              submit
                            </button>
                          </form>
                          <p>
                            Back to <a href="#" onClick={() => setShowForgotPasswordForm(false)}>Login</a>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src={import.meta.env.VITE_APP_BASE_API + image}  
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Login;