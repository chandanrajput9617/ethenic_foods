import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css';
import defaultpersonimg from "./images/defaultperson.png"


const Reviews = (props) => {
  const slickRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
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
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots:true,
          arrows:false
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
      <section id="review" className="m-5 mb-5">
        <div className="col-md-12 m-4 text-center">
          <h1>Reviews</h1>
        </div>
        <div className="container">
          <Slider
            {...settings}
            ref={slickRef}
            afterChange={handleAfterChange}
          >
            {props?.reviews?.map((item, reviewIndex) => (
              <>
                <div key={reviewIndex} style={{
                  marginRight: '5px',
                  marginLeft: "5px",
                  // margin:"auto",
                  // maxWidth:"275px"
                }}>
                  <div style={{margin:"auto", maxWidth:"275px"}}>
                  <div id="review_card">
                    <div id="card_top" >
                      <div id="profile" className="">
                        <div id="profile_image">
                          <img src={item.image ? `/api${item.image}` : defaultpersonimg} alt="Item" />
                          Copy

                        </div>
                        <div id="name" className="m-2">
                          <div>
                            <strong>{item.name}</strong>
                            <p>{item.age} year</p>
                          </div>
                          <div id="like" className=" text-warning">
                            {Array.from({ length: parseInt(item.rating, 10) }, (_, i) => (
                              <i key={i} className="fa-solid fa-star"></i>
                            ))}
                          </div>

                        </div>
                      </div>
                    </div>
                    <div id="comment" className="m-2 " style={{ height: "355px" }}>
                      <h6 className='text-break text-justify' style={{
                        display: 'block',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 6,
                        maxWidth: '100%',
                        height: 'calc(1.5em * 14)',
                        margin: '0 auto',
                        fontSize: '1em',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.reviews}
                      </h6>
                    </div>
                  </div>
                </div>
                </div>
              </>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Reviews;