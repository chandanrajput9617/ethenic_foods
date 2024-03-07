import React from 'react';
import { Button } from 'react-bootstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Modal = ({ showModal, setShowModal, data }) => {

  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    

  };

  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} id="exploreModal" tabIndex="-1" role="dialog" aria-labelledby="exploreModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" onClick={() => setShowModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">

            <Slider {...settings} className='slick-arrow with-background'>
              {data?.images?.map((image, index) => (
                <div key={index}>
                  <img src={"/api" + image} alt={`Modal Image $`} style={{ width: '50%', height: 'auto', margin: '0 auto' }} />
                </div>
              ))}
            </Slider>
          </div>
          <div>
            <div className='m-2'>
              <p>
                {data?.description}
              </p>
              <div style={{ display: 'flex' }}>
                <h6 className='mr-2'>Country:</h6>
                <p>{data?.country?.name}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: "10px" }}>
            <Button style={{ backgroundColor: '#4CAF50', color: '#fff', border: '1px solid #4CAF50', borderRadius: '5px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', margin:"3px" }}>
              Buy
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;
