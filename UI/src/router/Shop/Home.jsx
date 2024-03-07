import React, { useEffect, useState } from 'react'
import BestSellers from './BestSellers'
import Header from './Header'
import { Shopnow } from './Shopnow'
import { Allproduct } from './Allproduct'
import { Aboutus } from './Aboutus'
import { Faq } from './Faq'
import { Blog } from './Blog'
import { Footer } from './Footer'
import { getshowingdata } from './services/Api'
import Reviews from './Reviews'
import axios from 'axios'
import { useProductState } from './context/ProductContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '@/components/Loader'


export const Home = () => {
  const [show, setShow] = useState()
  const token = localStorage.getItem('token');
  const [loader, setLoader] = useState()
  const { setCartCount } = useProductState()
  useEffect(() => {
    fetchDataFromApi();
    if (token) {
      getcart();
    }
  }, []);

  const fetchDataFromApi = async () => {
    setLoader(true)
    try {
      const result = await getshowingdata("views/get-views");
      setShow(result.data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoader(false)
    }
  };

  const getcart = async () => {
    const response = await axios.get(import.meta.env.VITE_APP_BASE_API + '/api/v1/products/get-cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors'
    });
    setCartCount(response?.data?.data[0]?.items?.length)
  }

  if (!token) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    setCartCount(cart?.length || 0)
  }
  if (loader) return <Loader />;
  return (
    <>
      <Header />
      <Shopnow herosection={show?.hero_section} />
      <BestSellers />
      <Allproduct />
      <Aboutus aboutus={show?.about_us} />
      <Reviews reviews={show?.reviews} />
      <Blog blog={show?.blog} />
      <Faq reviews={show?.faq} />
      <Footer />
    </>
  )
}
