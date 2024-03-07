import React, { useRef } from 'react';
import { useProductState } from './context/ProductContext';
import ReactPlayer from 'react-player'; 

const VideoModal = ({data , title }) => {
 const {showvideomodal , setShowvideomodal} = useProductState()
 const playerRef = useRef(null);

 const handleClose = () => {
  if (playerRef.current) {
    const isYoutubeLink =
      data?.video_url?.includes('youtube.com') || data?.video_url?.includes('youtu.be');
    if (isYoutubeLink) {
      playerRef.current.getInternalPlayer().stopVideo();
    } else {
      playerRef.current.getInternalPlayer().pause();
    }
  }
  setShowvideomodal(false);
};

 const isYoutubeLink = data?.video_url?.includes('youtube.com') || data?.video_url?.includes('youtu.be');

 return (
  <div
    className={`modal fade ${showvideomodal ? 'show' : ''}`}
    id="videomodal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="explore360ModalLabel"
    aria-hidden={!showvideomodal}
    data-backdrop="static"
    data-keyboard="false"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content" style={{ height: '450px' }}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            {title}
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={handleClose}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body" style={{ height: '89%' }}>
          {isYoutubeLink ? (
            <div className="youtube-preview">
              <ReactPlayer
                ref={playerRef}
                url={data?.video_url}
                controls={true}
                width="480px"
                height="270px"
                onStop={handleClose}
              />
            </div>
          ) : (
            <video
              id="videoPlayer"
              controls
              width="100%"
              height="100%"
              style={{ maxHeight: '360px', minHeight: '330px' }}
            >
              <source src={import.meta.env.VITE_APP_BASE_API + data?.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default VideoModal;
