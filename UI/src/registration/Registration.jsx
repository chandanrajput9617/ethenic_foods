import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "./registration.css";
import { Button } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import Alert from "@/router/Shop/Alert";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Footer } from "@/router/Shop/Footer";
import Header from "@/router/Shop/Header";
import Loader from "@/components/Loader";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getshowingdata } from "@/router/Shop/services/Api";

const registrationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  repassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm Password is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipcode: Yup.string().required("Zipcode is required"),
});

const initialValues = {
  username: "",
  email: "",
  repassword: "",
  password: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
};

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [image,setImage] = useState()

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      const requestData = {
        userData: {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.repassword,
          address: values.address,
          city: values.city,
          state: values.state,
          zipcode: values.zipcode,
          country: values.country
        },
      };

      try {
        const response = await axios.post(import.meta.env.VITE_APP_BASE_API+"/api/v1/users/register", requestData);
        // Check the response and show the appropriate alert
        if (response.status === 201) {
          showAlert("success", "Registration successful!");
          action.resetForm();
          // history.push("/login")
        } else {
          showAlert("danger", "Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        showAlert("danger", error.response.data.error);
      }finally {
        setLoading(false); 
      }
    },
  });
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };
  useEffect(() => {
    fetchDataFromApi()
  }, []);

  const fetchDataFromApi = async () => {
    try {
      const result = await getshowingdata("views/get-views");
      setImage(result.data[0]?.loginBackgoundImg,"setimage");
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };
  return (
    <>
        {loading && <Loader/>}

      <div>
        {alert && <Alert type={alert.type} message={alert.message} />}
        <Header hideCart={true} />
        <section
          className="p-5 w-100"
          style={{ backgroundColor: "#eee", borderRadius: ".5rem .5rem 0 0" }}
        >
          <div className="row">
            <div className="col-12">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mt-4">Sign up</p>
                      <form onSubmit={handleSubmit}>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="username" className="form-label">
                              Username
                            </label>
                            <input
                              id="username"
                              name="username"
                              className="form-control"
                              value={values.username}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.username && touched.username ? (
                              <small className="text-danger mt-1">
                                {errors.username}
                              </small>
                            ) : null}
                          </div>
                        </div>
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
                              type="password"
                            />
                            {errors.password && touched.password ? (
                              <small className="text-danger mt-1">
                                {errors.password}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="repassword" className="form-label">
                              Confirm Password
                            </label>
                            <input
                              id="repassword"
                              name="repassword"
                              className="form-control"
                              value={values.repassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="password"
                            />
                            {errors.repassword && touched.repassword ? (
                              <small className="text-danger mt-1">
                                {errors.repassword}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="address" className="form-label">
                              Address
                            </label>
                            <input
                              id="address"
                              name="address"
                              className="form-control"
                              value={values.address}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.address && touched.address ? (
                              <small className="text-danger mt-1">
                                {errors.address}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="country" className="form-label">
                              Country
                            </label>
                            <input
                              id="country"
                              name="country"
                              className="form-control"
                              value={values.country}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.country && touched.country ? (
                              <small className="text-danger mt-1">
                                {errors.country}
                              </small>
                            ) : null}
                          </div>
                          <div className="col text-left">
                            <label htmlFor="city" className="form-label">
                              City
                            </label>
                            <input
                              id="city"
                              name="city"
                              className="form-control"
                              value={values.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.city && touched.city ? (
                              <small className="text-danger mt-1">
                                {errors.city}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="state" className="form-label">
                              State
                            </label>
                            <input
                              id="state"
                              name="state"
                              className="form-control"
                              value={values.state}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.state && touched.state ? (
                              <small className="text-danger mt-1">
                                {errors.state}
                              </small>
                            ) : null}
                          </div>
                          <div className="col text-left">
                            <label htmlFor="zipcode" className="form-label">
                              Zipcode
                            </label>
                            <input
                            type="text"
                              id="zipcode"
                              name="zipcode"
                              className="form-control"
                              value={values.zipcode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.zipcode && touched.zipcode ? (
                              <small className="text-danger mt-1">
                                {errors.zipcode}
                              </small>
                            ) : null}
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col text-right actionButtons">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={resetForm}
                            >
                              Clear
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleSubmit}
                            >
                              Register
                            </Button>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <br />
                          <div className="col text-right">
                            Already have an account? <Link to="/login">Login</Link>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2 mt-auto mb-auto">
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

export default Registration;
