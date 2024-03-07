import React, { useEffect, useRef, useState } from 'react'
import "./style.css"
import Slider from 'react-slick';
import axios from 'axios';
import png360 from "./images/360.png"
import usflag from "./images/USA_Flag_icon.png"
import vectorimg from "./images/Vector.png"
import { useProductState } from './context/ProductContext'
import videoimg from "./images/Group.png"
import "./style.css"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { Stack } from 'react-bootstrap'
import { Rating } from '@mui/material'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BestSellers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const { handleaddtocard, handleExploreClicks, handleSocialmedia, handleVideomodal } = useProductState();
  const history = useHistory()
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          import.meta.env.VITE_APP_BASE_API + "/api/v1/products/get-best-seller-product",
          {
            headers: {
              "Content-Type": "application/json"
            },
            mode: 'cors'
          }
        );
        const bestSellers = response.data.data
        setData(bestSellers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataFromApi();
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 5,
    swipe: true,
    draggable: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,

        },
      },
      {
        breakpoint: 600,
        slidesToScroll: 1,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,

          arrows: false,
        },
      },
      {
        breakpoint: 480,
        slidesToScroll: 1,
        settings: {
          slidesToShow: 1,
          dots: true,
          slidesToScroll: 1,

          arrows: false
        },
      },
    ],
  };

  return (
    <>
      <div className="container" id='bestsellers'>
        <section id="search" className="mt-5">
          <div className="col-md-12 mt-5 mb-5 text-center">
            <h1>Bestsellers</h1>
          </div>
          <div className="row" style={{ minHeight: '50vh' }}>
            {loading ? (
              <div className='container'>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                  <div className="spinner-border" role="status">
                  </div>
                </div>
              </div>
            ) : data && data.length ? (
              <div className='container'>
                <Slider ref={sliderRef} {...settings} className='d-flex'>
                  {data.map((item, key) => {
                    return (
                      <>
                        <div style={{
                          marginRight: '5px',
                          marginLeft: "5px"
                        }}>
                          <div className="mb-4 border border-success card-container" style={{ maxWidth: '225px', margin: "auto" }}>
                            <div className="d-flex mx-auto h-100">
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                  <img src={import.meta.env.VITE_APP_BASE_API + item?.product?.images[0]} className="text-center m-2 img-fluid" alt="#" />
                                </div>              <div className="card-content mx-2">
                                  <h3 className="product-title" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '20px', marginTop: '13px' }}><strong>{item?.product?.title}</strong></h3>
                                  <div>
                                    <p className="product-description" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {item?.product?.short_description}
                                    </p>
                                  </div>
                                  <div className='d-flex flex-row align-items-center'>
                                    <h5>Origin County:</h5>
                                    <img src={usflag} alt="#" className='my-auto' />
                                  </div>
                                  <div className="product-actions">
                                    <div className='d-flex flex-row '>
                                      {item.product?.zipFile_url && <div className="mr-3">
                                        <img
                                          src={png360}
                                          alt="png360"
                                          onClick={() => handleExploreClicks(item)}
                                          data-toggle="modal"
                                          data-target="#explore360Modal"
                                          style={{ cursor: 'pointer' }}
                                        />
                                      </div>}
                                      <div>
                                        <div className="mr-3">
                                          <img alt='vector' src={vectorimg}
                                            onClick={() => handleSocialmedia(item)}
                                            data-toggle="modal"
                                            data-target="#socialmedia"
                                            style={{ cursor: 'pointer' }}
                                          />
                                        </div>
                                      </div>
                                      {item.product?.video_url && <div>
                                        <div className="mr-3">
                                          <img alt='vector' src={videoimg}
                                            onClick={() => handleVideomodal(item)}
                                            data-toggle="modal"
                                            data-target="#videomodal"
                                            style={{ cursor: 'pointer', width: "22px", height: "20p" }}
                                          />
                                        </div>
                                      </div>}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-center">{formatter.format(item?.product?.price)}</h3>
                                  </div>
                                  <div className="d-grid gap-3 mt-1">
                                    <button
                                      className="btn btn-success btn-block"
                                      onClick={() => handleaddtocard(item)}
                                      data-target="#myModal2"
                                      data-toggle="modal"
                                    >
                                      Add to cart
                                    </button>
                                    <button
                                      className="btn btn-white btn-block border border-success mb-1"
                                      onClick={() => window.open(`/productdetail/${item?.product?._id}`, "_blank")}
                                      data-toggle="modal"
                                      data-target="#exploreModal"
                                    >
                                      Explore
                                    </button>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Stack spacing={1}>
                                      <Rating name="half-rating-read" defaultValue={item?.productRewiev?.rating} precision={0.5} readOnly />
                                    </Stack>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })}
                </Slider>
              </div>
            ) : (
              <div className="col-md-12 text-center">
                <p>No products available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
export default BestSellers

