import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const WithAuth = (props) => {
  const history = useHistory();


  const unprotectedRoutes = [
    'paymentsucess',
    'PaymentCancel',
    'productdetail',
    'reset-password'
  ]

useEffect(() => {
  
  const cookie_token = localStorage.getItem("token");
 
  if (cookie_token) {
    const decodedToken = jwtDecode(cookie_token);
    const userType = decodedToken.role;

    if (userType === "user") {
      return;
    } else {
      history.push("/admin");
      return;
    }
  }
const check = history.location.pathname.split("/")[1]

  if (unprotectedRoutes.includes(check)) {
    history.push(history.location.pathname)
    return 
  }

  history.push("/");
}, []);

  return <>{props.children}</>;
};

export default WithAuth;
