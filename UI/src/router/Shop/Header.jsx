import React, { useEffect, useState } from 'react';
import "./style.css";
import ethnicLogo from './images/logo 2 2.png';
import { Button, Dropdown } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import defaultpersonimg from "./images/defaultperson.png"
import { HashLink as Link } from 'react-router-hash-link';
import axios from 'axios';
import { useProductState } from './context/ProductContext';
import Alert from './Alert';
import Loader from '@/components/Loader';
import { FaYoutube, FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaPinterest, FaSnapchat } from 'react-icons/fa';


const Header = ({ hideCart, hidebutton }) => {
  const [socialMedia, setSocialMedia] = useState()
  const navStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: 'white',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 'auto'
  };

  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartCount } = useProductState()
  const [alert, setAlert] = useState(null);


  const socialMediaLinks = {
    youtube: socialMedia?.youtube?.link,
    facebook: socialMedia?.facebook?.link,
    instagram: socialMedia?.instagram.link,
    linkedin: socialMedia?.linkedin.link,
    tiktok: socialMedia?.tiktok.link,
    pinterest: socialMedia?.pinterest?.link,
    snapchat: socialMedia?.snapchat?.link,
  };


  useEffect(() => {
    fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/social-media-link')
      .then((response) => response.json())
      .then((data) => {
        const { facebook, twitter, instagram, linkedin, youtube, pinterest, snapchat, tiktok } = data.data;
        setSocialMedia({ facebook, twitter, instagram, linkedin, youtube, pinterest, snapchat, tiktok });
      })
      .catch((error) => {
        console.error('Error fetching social media links:', error);
      });
  }, []);
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function handleBasketClick() {
    navigate.push("/cart");
  }

  function countCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  }

  useEffect(() => {
    countCartItems();
  }, []);

  const handleLogout = async () => {
    setLoading(true)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.get(import.meta.env.VITE_APP_BASE_API + '/api/v1/users/logout', {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          mode: 'cors'
        });
        localStorage.clear();
        setIsLoggedIn(false);
        showAlert("danger", "Logout sucessfully");
        setTimeout(() => {
          navigate.push("/");
        }, 1000);
      } catch (error) {
        console.error('Error logging out:', error);
        showAlert("danger", "Logout failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }
  const scrollToBestseller = () => {
    const bestsellerSection = document.getElementById('bestsellers');
    if (bestsellerSection) {
      bestsellerSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  { loading && <Loader /> }
  return (
    <>
      {alert && <Alert type={alert.type} message={alert.message} />}
      <header>
        <div className="main-header">
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div className="container">
              <nav style={navStyles}>
                <Link to="/">
                  <img src={ethnicLogo} className="logo" alt="#" />
                </Link>
                <ul style={{ 'margin': 0 }}>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/#Herosection">Shop</Link></li>
                  <li><Link to="/#About">About Us</Link></li>
                  <li><Link to="/#review">Review</Link></li>
                  <li><Link to="/#Blog">Blog</Link></li>
                  <li><Link to="/#FAQ">FAQ</Link></li>
                  <li><Link to="/#footer">Contact</Link></li>
                </ul>
                <div className="d-flex justify-content-center align-items-center" style={{ flexDirection: 'row', gap: '5px' }}>
                  {!hideCart && (
                    <div className="icons" onClick={handleBasketClick}>
                      <i className="fa badge fa-lg"
                        value={cartCount}>
                        &#xf290;
                      </i>
                    </div>
                  )}
                  {!isLoggedIn && !hidebutton && (
                    <div>
                      <Button style={{ background: "green" }} onClick={() => navigate.push("/login")}>Login</Button>
                    </div>
                  )}
                  {isLoggedIn && (
                    <Dropdown>
                      <Dropdown.Toggle as="div" style={{ borderRadius: '40%', width: '40px', height: '40px' }}>
                        <img src={defaultpersonimg} alt="User Profile" className="profile-image" style={{ width: '80%', height: '80%' }} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu show={false}>
                        <Dropdown.Item as={Link} to="/yourprofile">Your Profile</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}

                </div>
                <div className="hambagarmenu" style={{ fontSize: "30px" }}>
                  <i className="fa-solid fa-bars dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item"><Link to="/" style={{ color: 'green' }}>Home</Link></a>
                    <a className="dropdown-item"><Link to="/banner" style={{ color: 'green' }}>Shop</Link></a>
                    <a className="dropdown-item"><Link to="/#About" style={{ color: 'green' }}>About Us</Link></a>
                    <a className="dropdown-item"><Link to="/#review" style={{ color: 'green' }}>Review</Link></a>
                    <a className="dropdown-item"><Link to="/#Blog" style={{ color: 'green' }}>Blog</Link></a>
                    <a className="dropdown-item"><Link to="/#FAQ" style={{ color: 'green' }}>FAQ</Link></a>
                    <a className="dropdown-item" onClick={() => scrollToSection('footer')} style={{ cursor: "pointer" }}><span style={{ color: 'green' }}>Contact</span></a>
                  </div>
                </div>
              </nav>
            </div>
            <div>
              <div className='socialmedios' style={{ display: "flex", gap: "9px", flexDirection: "row" }}>
                <a href={socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube size={20} style={{ color: "green" }} />
                </a>
                <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebookF size={20} style={{ color: "green" }} />
                </a>
                <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={20} style={{ color: "green" }} />
                </a>
                <a href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn size={20} style={{ color: "green" }} />
                </a>
                <a href={socialMediaLinks.tiktok} target="_blank" rel="noopener noreferrer">
                  <FaTiktok size={20} style={{ color: "green" }} />
                </a>
                <a href={socialMediaLinks.pinterest} target="_blank" rel="noopener noreferrer">
                  <FaPinterest size={20} style={{ color: "green" }} />
                </a>
                <a href={socialMediaLinks.snapchat} target="_blank" rel="noopener noreferrer">
                  <FaSnapchat size={20} style={{ color: "green" }} />
                </a>
              </div>
            </div>
          </div>


        </div>
        <div className='socialmediosinmobileview'>
          <div className='' style={{ display: "flex", gap: "9px", flexDirection: "row", justifyContent: "flex-end", marginTop: "4px", marginRight: "10px" }}>
            <a href={socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer">
              <FaYoutube size={20} style={{ color: "green" }} />
            </a>
            <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebookF size={20} style={{ color: "green" }} />
            </a>
            <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram size={20} style={{ color: "green" }} />
            </a>
            <a href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn size={20} style={{ color: "green" }} />
            </a>
            <a href={socialMediaLinks.tiktok} target="_blank" rel="noopener noreferrer">
              <FaTiktok size={20} style={{ color: "green" }} />
            </a>
            <a href={socialMediaLinks.pinterest} target="_blank" rel="noopener noreferrer">
              <FaPinterest size={20} style={{ color: "green" }} />
            </a>
            <a href={socialMediaLinks.snapchat} target="_blank" rel="noopener noreferrer">
              <FaSnapchat size={20} style={{ color: "green" }} />
            </a>
          </div>

        </div>

      </header>
    </>
  );
}

export default Header;