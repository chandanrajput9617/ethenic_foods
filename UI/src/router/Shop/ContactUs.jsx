import React, { useState } from 'react';
import Header from './Header';
import { Footer } from './Footer';
import axios from 'axios';
import Alert from './Alert';
import { useProductState } from './context/ProductContext';

const ContactUs = () => {
  const {showAlert, setShowAlert, setAlertMsg, alertmsg } = useProductState();

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.name || !formValues.email || !formValues.subject || !formValues.message) {
      setAlertMsg('please fill all field');
      setShowAlert(true);
      setTimeout(() => {
        setAlertMsg("");
        setShowAlert(false);
      }, 2000);
      return;
    }
    try {
      const response = await axios.post(import.meta.env.VITE_APP_BASE_API + '/api/v1/contact-us', formValues, {
        headers: {
          "Content-Type": "application/json"
        },
        mode: 'cors'
      });
      setFormValues({
        name: '',
        email: '',
        subject: '',
        message: ''
      });      
      setAlertMsg('submit successfully');
      setShowAlert(true);
      setTimeout(() => {
        setAlertMsg("");
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending contact form:', error);
    }
  };

  return (
    <>
     {showAlert && <Alert type="success" message={alertmsg} />}
      <Header />
      <section className="mb-4 container" style={{
        marginTop: "80px",
        border: '1px solid white',
        padding: '20px',
        borderRadius: '5px',
        backgroundColor: '#f8f9fa' // Added a background color for contrast
      }}> {/* Add container class here */}
        <h2 className="h1-responsive font-weight-bold text-center my-4">Contact us</h2>
        <p className="text-center w-responsive mx-auto mb-5">
          Do you have any questions? Please do not hesitate to contact us directly. Our team will come back to you within
          a matter of hours to help you.
        </p>

        <div className="row">
          <div className="col-md-9 mb-md-0 mb-5">
            <form id="contact-form" name="contact-form" onSubmit={handleSubmit} >
              <div className="row">
                <div className="col-md-6">
                  <div className="md-form mb-0">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formValues.name}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="name" className="">Your name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="md-form mb-0">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formValues.email}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="email" className="">Your email</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="md-form mb-0">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      value={formValues.subject}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="subject" className="">Subject</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="md-form">
                    <textarea
                      type="text"
                      id="message"
                      name="message"
                      rows="2"
                      className="form-control md-textarea"
                      value={formValues.message}
                      onChange={handleInputChange}
                    ></textarea>
                    <label htmlFor="message">Your message</label>
                  </div>
                </div>
              </div>
              <div className="text-center text-md-left">
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
          <div className="col-md-3 text-center">
            <ul className="list-unstyled mb-0">
              <li><i className="fas fa-map-marker-alt fa-2x"></i>
                <p>Trussville Crossings Pkwy, 5919 , Birmingham
                </p>
              </li>
              <li><i className="fas fa-phone mt-4 fa-2x"></i>
                <p>+1 617 817 2625</p>
              </li>
              <li><i className="fas fa-envelope mt-4 fa-2x"></i>
                <p>contact@ethnicfoods.com</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;