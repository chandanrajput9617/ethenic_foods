import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
// import AddProduct from "./AddProduct";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import Loader from "@/components/Loader";
import Logo from "./Logo";
import { useAdminState } from "@/contexts/AdminContext";
import Alert from "@/router/Shop/Alert";
import LoginPageImage from "./LoginPageImage";

const Page = () => {
  const match = useRouteMatch();
  const [data, setData] = useState(null);
  const {  alert } = useAdminState();

  useEffect(() => {
    fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/views/get-views")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data.data[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  if (!data) return <Loader />;
console.log(data,"dataa");
  return (
    <>
    {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}

    <Switch>
      <Route path={match.path + "/new"}>{/* <AddProduct /> */}</Route>

      <Route path={match.path}>
        <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
          <div>
            <h1 className="text-3xl font-medium">Customization</h1>
          </div>
          <div>
            {/* <Link to={match.path + "/new"}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className="whitespace-nowrap w-max text-white !p-3 !bg-indigo-500 hover:!bg-indigo-600 !rounded-md"
              >
                Add Product
              </Button>
            </Link> */}
          </div>
        </div>

        <Accordion expanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography fontSize="24px">Logo</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Logo data={data["logo"]} />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontSize="24px">Hero Section</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <HeroSection data={data["hero_section"]} />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography fontSize="24px">About Us Section</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AboutSection data={data["about_us"]} />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontSize="24px">Log in page image</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LoginPageImage data={data["loginBackgoundImg"]} />
          </AccordionDetails>
        </Accordion>
      </Route>
    </Switch>
    </>
  );
};

export default Page;
