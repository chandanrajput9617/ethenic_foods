
import { Route, Switch } from "react-router-dom";
import AdminPage from "./Admin/Page";
import ShopPage from "./Shop/Page";

const Page = () => {
  return (
    <Switch>
      <Route path="/admin">
        <AdminPage />
      </Route> 
      <Route path="/">
        <ShopPage />
      </Route>
    </Switch>
  );
};
export default Page;
