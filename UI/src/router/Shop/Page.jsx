import { Route, Switch } from "react-router-dom";
import Login from "@/Login/Login";
import Registration from "@/registration/Registration";
import Cart from "./Cart";
import { Home } from "./Home";
import Strip from "./strip/Strip";
import Productdetailpage from "./Productdetailpage";
import { ProductContexts } from "./context/ProductContext";
import Yourprofile from "./Yourprofile";
import PaymentSuccess from "./PaymentSuccess";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ContactUs from "./ContactUs";
import PaymentCancel from "./PaymentCancel";
import UserOrderDetails from "./UserOrderDetails";
import WithAuth from "@/components/WithAuth";
import Blogs from "./Blogs";
import ResetPassword from "@/ResetPassword/ResetPassword";
import { Helmet } from 'react-helmet';

const Page = () => {
  return (
    <>       
    <Helmet>
        <title>Ethnic Foods</title>
        <meta name="description" content="Get your favorite food" />
      </Helmet>                             
    <Switch>
    <ProductContexts>
    <Route exact path="/reset-password/:token">
          <ResetPassword/>
        </Route>
    <Route exact path="/productdetail/:id">
          <Productdetailpage />
        </Route>
        <Route exact path="/paymentsucess">
          <PaymentSuccess />
        </Route>
        <Route exact path="/PaymentCancel">
          <PaymentCancel />
        </Route>
        </ProductContexts>
    </Switch>
    <WithAuth>
    <Switch>
      <ProductContexts>
      <Route exact path="/blogs">
          <Blogs />
        </Route>
      <Route exact path="/strip">
          <Strip/>
        </Route>
        <Route exact path="/contactus">
          <ContactUs />
        </Route>
        <Route exact path="/userorderdetail">
          <UserOrderDetails />
        </Route>  
        <Route exact path="/strip">
          <Strip />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Registration />
        </Route>

        <Route exact path="/shop">
          {/* <ShopPage /> */}
          <Home />
        </Route>
        <Route exact path="/cart">
          <Cart />
        </Route>
        <Route exact path="/yourprofile">
          <Yourprofile />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </ProductContexts>
    </Switch>
    </WithAuth>
    </>

  );
};

export default Page;
