import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const PaymentCancel = () => {
    const history = useHistory();

    const handleBackHomeClick = () => {
        history.push('/');
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div>
                <div className="mb-4 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-danger" width="75" height="75"
                                        style={{display:"inline"}}
                        fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h1>Payment Cancelled</h1>
                    <p>We're sorry your transaction was not completed. Lorem ipsum dolor sit, </p>
                    <Button variant="primary" onClick={handleBackHomeClick}>Back Home</Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;