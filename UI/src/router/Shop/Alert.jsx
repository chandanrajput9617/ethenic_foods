import React from 'react';

const Alert = ({ type, message }) => {
 const alertClass = `alert alert-${type} fixed-top mx-auto w-50 text-center  mt-5`;

 return (
    <div className={alertClass} role="alert">
      {message}
    </div>
 );
};

export default Alert;