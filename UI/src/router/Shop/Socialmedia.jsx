import React from 'react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  InstapaperShareButton
} from 'react-share';
import {
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  InstapaperIcon
} from "react-share";
import { useProductState } from './context/ProductContext';

const Socialmedia = ({ showModal, setShowModal , productId }) => {
  const {showsocial , setShowSocial} = useProductState()
  const shareUrl = `https://www.ethnicfoods.com/productdetail/${productId}`;
  const title = 'Check out this awesome product!';

  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} id="socialmedia" tabIndex="-1" role="dialog" aria-labelledby="exploreModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3>
                Social Media
            </h3>
            <button type="button" className="close"  data-dismiss="modal" onClick={() => setShowModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Facebook Share Button */}
              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>

              {/* Twitter Share Button */}
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>

              {/* LinkedIn Share Button */}
              <LinkedinShareButton url={shareUrl} title={title}>
                <LinkedinIcon size={32} round={true} />
              </LinkedinShareButton>

              {/* WhatsApp Share Button */}
              <WhatsappShareButton url={shareUrl} title={title}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>

              {/* Instapaper Share Button */}
              <InstapaperShareButton url={shareUrl} title={title}>
                <InstapaperIcon size={32} round={true} />
              </InstapaperShareButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Socialmedia;
