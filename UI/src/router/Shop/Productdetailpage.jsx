import React, { useEffect, useRef, useState } from 'react'
import "./Productdetailpage.css"
import { useLocation } from "react-router-dom";
import Header from './Header';
import { Button, Stack } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { useProductState } from './context/ProductContext';
import { useParams } from 'react-router-dom';
import Alert from './Alert';
import { Footer } from './Footer';
import { Container, Row, Col } from 'react-bootstrap';
import { Rating } from '@mui/material';
import defaultpersonimg from "./images/defaultperson.png"
import Loader from '@/components/Loader';
import axios from 'axios';
import { StarContainer } from './ReviewModal';
import { Radio } from 'react-loader-spinner';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import ReCAPTCHA from "react-google-recaptcha";

// export const Container = styled.div`
//    display: flex;
//    justify-content: center;
//    align-items: center;
//    min-height: 60vh;
//    font-size: 60px;
// `;
export const Radios = styled.input`
   display: none;
`;
export const Ratingss = styled.div`
   cursor: pointer;
`;
export const StarContainers = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`;
const Productdetailpage = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const { handleaddtocard, showAlert, setShowAlert, setAlertMsg, alertmsg, productload, setProductLoad, } = useProductState();
  const { id } = useParams();
  const { createMarkup } = useProductState();
  const playerRef = useRef(null);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState("");


  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const token = localStorage.getItem("token");

  const youtubeLink = "https://www.youtube.com/watch?v=sSKhdZ32YpY"


  useEffect(() => {
    setProductLoad(true);
    const fetchProduct = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_APP_BASE_API + `/api/v1/products/get-single-product/${id}`, {
          headers: {
            "Content-Type": "application/json"
          },
          mode: 'cors'
        });
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setProductLoad(false);
      }
    };
    fetchProduct();
  }, [id]);
  useEffect(() => {
    if (product?.product[0]?.product?.images.length > 0) {
      setSelectedImage(product?.product[0]?.product?.images[0])
      setIsVideo(false);
    }
  }, [product]);
  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };
  const submitReview = async () => {
    if (!recaptchaToken) {
      setAlertMsg("Please complete the reCAPTCHA challenge.");
      setShowAlert(true);
      setTimeout(() => {
        setAlertMsg("");
        setShowAlert(false);
      }, 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`/api/api/v1/products/create-product-review/${product?.product[0]?.product?._id}`, {
        rating: rate,
        comment: comment,
        recaptchaToken: recaptchaToken, // Include this in your backend verification

      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        mode: 'cors'
      });
      setRate(0);
      setComment('');
      setRecaptchaToken("");
      setAlertMsg('Review Add successfully');
      setShowAlert(true);
      setTimeout(() => {
        setAlertMsg("");
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      setAlertMsg(' you already  Add review');
      setShowAlert(true);
      setTimeout(() => {
        setAlertMsg("");
        setShowAlert(false);
      }, 3000);
      console.error(error);
    }
  };
  console.log(product?.product[0].product.reviews,"revierww");
  return (
    <>
      {productload && <Loader />}
      <Header />
      {showAlert && <Alert type="success" message={alertmsg} />}
      <Container className='mt-5'>
        <Row>
          <Col xs={12} md={2} style={{ marginTop: "20px" }}>
            <div className="image-list d-flex align-items-center">
              {product?.product[0]?.product?.images.map((image, index) => (
                <img
                  key={index}
                  src={import.meta.env.VITE_APP_BASE_API + image}
                  alt=""
                  onMouseOver={() => {
                    setSelectedImage(image);
                    setIsVideo(false);
                  }}
                />
              ))}
              {product?.product[0]?.product?.video_url && (
                <video width="100" height="100"
                  style={{ height: "100px" }}
                  src={import.meta.env.VITE_APP_BASE_API + product?.product[0]?.product?.video_url}
                  onMouseOver={() => {
                    setSelectedImage(product?.product[0]?.product?.video_url);
                    setIsVideo(true);
                  }}
                >
                  <source src={import.meta.env.VITE_APP_BASE_API + product.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </Col>
          <Col xs={12} md={5} style={{ marginTop: "20px" }}>
            <div className="large-image">
              {isVideo ? (
                <video width="500" height="500" controls autoPlay>
                  <source src={import.meta.env.VITE_APP_BASE_API + selectedImage} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={import.meta.env.VITE_APP_BASE_API + selectedImage} alt="" />
              )}
            </div>
          </Col>
          <Col xs={12} md={5} style={{ marginTop: "20px" }}>
            <div className="product-details">
              <h2>{product?.product[0]?.product?.title}</h2>
              <div className="product-reviews" >
                <h5>Rating</h5>
                <Stack spacing={1}>
                  <Rating name="half-rating-read" defaultValue={product?.product[0]?.product?.productOverAllReviews} precision={0.5} readOnly />
                </Stack>
                <p>This product is great!</p>
              </div>
              <div>
                <p>Price: <h3>{formatter.format(product?.product[0]?.product?.price)}</h3> </p>
              </div>
              <p dangerouslySetInnerHTML={createMarkup(product?.product[0]?.product?.description)}></p>

              <Button style={{ backgroundColor: 'green' }}
                onClick={() => handleaddtocard(product?.product[0])}
              >Add to cart</Button>
              <div>
                {
                  product?.youtube_video_url &&
                  <div className="youtube-preview">
                    <ReactPlayer
                      ref={playerRef}
                      url={product?.youtube_video_url}
                      controls={true}
                      width="480px"
                      height="270px"
                    />
                  </div>
                }
                {
                 product?.product[0]?.product?.reviews?.length > 0 &&
                  <>
                    <div style={{ marginTop: "10px" }}>
                      <h5>
                        Reviews
                      </h5>
                    </div>
                    <div style={{ marginTop: "30px" }}>
                      {
                       product?.product[0]?.product?.reviews?.map((item) => (
                          <>
                            <div className="row" style={{ display: "flex", flexDirection: "column", margin: "auto", marginTop: "10px" }}  >
                              <div className="col-md-4 " style={{ display: "flex", gap: "10px" }}>
                                <div>
                                  <img alt="Sample Image" style={{ maxHeight: "35px", width: "auto" }} src={defaultpersonimg} />

                                </div>
                                <div>
                                  {item.username}
                                </div>
                              </div>
                              <div className="col-md-12 " style={{ marginLeft: "30px" }}>
                                {item.comment}
                              </div>
                              <div className="col-md-2" style={{ marginLeft: "30px" }}>
                                <Stack spacing={1}>
                                  <Rating name="half-rating-read" defaultValue={item?.rating} precision={0.5} readOnly />
                                </Stack>
                              </div>
                            </div>
                          </>
                        ))
                      }
                    </div>
                  </>
                }

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "5px" }}>
                  <h5>
                    Add  Reviews
                  </h5>
                  <>
                    <StarContainers>
                      {[...Array(5)].map((item, index) => {
                        const givenRating = index + 1;
                        return (
                          <>
                            <label>
                              <Radios
                                type="radio"
                                value={givenRating}
                                onClick={() => {
                                  setRate(givenRating);
                                }}
                              />
                              <Ratingss>
                                <FaStar
                                  style={{ fontSize: "x-large" }}
                                  color={
                                    givenRating < rate || givenRating === rate
                                      ? "000"
                                      : "rgb(192,192,192)"
                                  }
                                />
                              </Ratingss>
                            </label>
                          </>
                        );
                      })}
                    </StarContainers>
                    <textarea
                      placeholder="Leave a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ width: '100%', marginTop: '10px', marginBottom: '10px', border: "ActiveBorder" }}
                    />
                    <div style={{ alignItems: "center" }}>
                      <ReCAPTCHA
                        sitekey="6Ld1nHsnAAAAAAR16FyQLgLBpV1i4ypNcpiplGUW" // Replace this with your actual site key
                        onChange={onRecaptchaChange}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={submitReview}
                      style={{ marginTop: "5px", width: "100px" }} // Adjust the width as needed
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  )
}
export default Productdetailpage
