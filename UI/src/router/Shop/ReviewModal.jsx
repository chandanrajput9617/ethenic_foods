import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import Alert from './Alert';



export const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 60vh;
   font-size: 60px;
`;
export const Radio = styled.input`
   display: none;
`;
export const Rating = styled.div`
   cursor: pointer;
`;
export const StarContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 10px;
`;

const ReviewModal = ({ reviewmodal, setReviewModal, productId }) => {

    const [rate, setRate] = useState(0);
    const [comment, setComment] = useState('');
    const [alert, setAlert] = useState(null);

    const showAlert = (type, message) => {
      setAlert({ type, message });
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    };
  
    const handleClose = () => {
        setReviewModal(false);
    };
    const submitReview = async () => {
        try {
            const token = localStorage.getItem("token"); 
            const response = await axios.post(`/api/api/v1/products/create-product-review/${productId}`, {
                rating: rate,
                comment: comment
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                mode: 'cors'
            });
            showAlert('success', 'Review submitted successfully');

        } catch (error) {
            showAlert("danger", error.response.data.error);

            console.error(error);
        }
        setReviewModal(false);

    };
   
    useEffect(() => {
        if (!reviewmodal) {
            setRate(0);
            setComment("")
        }
    }, [reviewmodal]);
 
    return (
        <>
        {alert && <Alert type={alert.type} message={alert.message} />}
        <div className={`modal fade ${reviewmodal ? 'show' : ''}`} id="reviewmodalmodal" tabIndex="-1" role="dialog" aria-labelledby="explorereviewmodal" aria-hidden={!reviewmodal} data-backdrop="static" data-keyboard="false">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Review</h5>
                        <button type="button" className="close" data-dismiss="modal" onClick={handleClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body"  style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <>
                        <StarContainer>
                            {[...Array(5)].map((item, index) => {
                                const givenRating = index + 1;
                                return (
                                    <>
                                        <label>
                                            <Radio
                                                type="radio"
                                                value={givenRating}
                                                onClick={() => {
                                                    setRate(givenRating);
                                                }}
                                            />
                                            <Rating>
                                                <FaStar
                                                style={{fontSize:"x-large"}}
                                                    color={
                                                        givenRating < rate || givenRating === rate
                                                            ? "000"
                                                            : "rgb(192,192,192)"
                                                    }
                                                />
                                            </Rating>
                                        </label>
                                    </>
                                );
                            })}
                            </StarContainer>
                            <textarea
                            placeholder="Leave a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}
                        />
                            <button type="button" onClick={submitReview} className="btn btn-outline-success close" aria-label="Close" data-dismiss="modal">Submit</button>
                        </>
                    </div>
                </div>
            </div>
        </div>
        </>
    );

}

export default ReviewModal







