import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useProductState } from './context/ProductContext';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Loader = () => (

  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

export const Blog = (props) => {
  const history = useHistory();

  const slickRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const {createMarkup } = useProductState();


  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setIsLoaded(true);
    };
    fetchData();
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots:true
        },
      },
    ],
  };

  useEffect(() => {
    if (isLoaded && slickRef.current) {
      slickRef.current.slickGoTo(0);
    }
  }, [isLoaded]);

  const handleAfterChange = (currentSlide) => {
    if (currentSlide === 0) {
      setIsLoaded(true);
    }
  };

  return (
    <>
      {!isLoaded && <Loader />} 
      {isLoaded && (
        <section id="Blog" className="mb-5 mt-5" >
          <div className="col-md-12 m-4 text-center">
            <h1>Blog</h1>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div id="blog_main">
                     {props?.blog?.length > 0 ? (
                        <div style={{ cursor: 'pointer' }}>
                        <Slider ref={slickRef} {...settings} afterChange={handleAfterChange}>
                        {props?.blog?.map((blogItem, index) => (
                          <div key={index} className="single-box" style={{cursor:"pointer"}}  onClick={() => history.push("/blogs", { selectedBlog: blogItem })}>
                            <div className="img-area">
                              <img src={import.meta.env.VITE_APP_BASE_API+blogItem.image} alt={`Blog ${index + 1}`}  style={{height: '220px'}}/>
                            </div>
                            <div className="mt-3">
                              <p>
                                {new Date(blogItem.createdAt).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                              <h6 className='text-break text-justify' style={{
                                display: 'block',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 6,
                                maxWidth: '100%',
                                height: 'calc(1.5em * 10)',
                                margin: '0 auto',
                                fontSize: '1em',
                                lineHeight: '1.5',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              dangerouslySetInnerHTML={createMarkup(blogItem?.content)}
                              >
                              </h6>
                            </div>
                          </div>
                        ))}
                      </Slider>
                      </div>
               ) : (
                <p style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>There is no blog now</p>
                )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
