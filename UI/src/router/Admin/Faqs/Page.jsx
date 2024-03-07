import Loader from "@/components/Loader";
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useEffect } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";

import { useAdminState } from "@/contexts/AdminContext";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddReview from "./AddFAQs";
import Alert from "@/router/Shop/Alert";

const Page = () => {
  const { faqs, setFaqs } = useAdminState();
  const {setAlert,alert } = useAdminState();
  const match = useRouteMatch();

  useEffect(() => {
    const fetchReviews = () => {
      fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/views/get-views")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setFaqs(data.data[0].faq);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    fetchReviews();
  }, []);

  const handleDelete = (id) => {
    fetch(
      `${
        import.meta.env.VITE_APP_BASE_API
      }/api/v1/views/delete-faq-views/${id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setAlert({errType:"danger", errMsg:"Delete Sucessfully", isError: true});
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setFaqs(faqs.filter((faq) => faq._id !== id));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!faqs) return <Loader />;

  return (
    <>
    {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}

    <Switch>
      <Route path={match.path + "/new"}>
        <AddReview />
      </Route>

      <Route path={match.path}>
        <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
          <div>
            <h1 className="text-3xl font-medium">Frequently asked questions</h1>
          </div>
          <div>
            <Link to={match.path + "/new"}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className="whitespace-nowrap w-max text-white !p-3 !bg-indigo-500 hover:!bg-indigo-600 !rounded-md"
              >
                New FAQ
              </Button>
            </Link>
          </div>
        </div>

        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ margin: "20px 0" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography>{faq.question}</Typography>
                <IconButton
                  edge="start"
                  aria-label="delete"
                  onClick={() => handleDelete(faq._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Route>
    </Switch>
    </>
  );
};

export default Page;
