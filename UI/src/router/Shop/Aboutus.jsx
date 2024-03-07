import React, { useEffect, useState } from 'react'
import "./style.css"
import videos from "./images/Group.png"
import AboutusDefaultimg from "./images/image 7.png"
import VideoModal from './VideoModal';
import { useProductState } from './context/ProductContext';

export const Aboutus = (props) => {
    const [showvideomodal,setShowvideomodal]=useState(null);
    const [videodata,setVideoData] = useState()
    const {createMarkup } = useProductState();
    const handleVideomodal = (item) => {
        setVideoData(item);
        setShowvideomodal(true);
      };
   

    return(
        <>
        {showvideomodal && <VideoModal showModal={showvideomodal} setShowModal={setShowvideomodal} data={videodata} title="About us video"/>}
            <section id="About">
                <div className="col-md-12 mt-5 mb-5 text-center">
                    <h1>About us</h1>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-5">
                        <div className="about-text">
                            <div className=" m-5 justify-content-center" dangerouslySetInnerHTML={createMarkup(props?.aboutus?.text)}
                            >
                            </div>
                            {props?.aboutus?.video_url && (
                                <img alt="youtube_logo" src={videos} className="px-5"          
                                onClick={() => handleVideomodal(props?.aboutus)}
                                data-toggle="modal"
                                data-target="#videomodal"
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <img alt="food_image" src={props.image ? import.meta.env.VITE_APP_BASE_API+props?.image :AboutusDefaultimg} className=" align-items-end" />  
                    </div>
                </div>
            </section>
        </>
    )
}
