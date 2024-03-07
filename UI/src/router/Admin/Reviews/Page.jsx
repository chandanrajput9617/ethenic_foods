import Loader from "@/components/Loader";
import { Add as AddIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, Route, useRouteMatch, Switch } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import AddReview from "./AddReview";
import EditReview from "./EditReview";
import { useAdminState } from "@/contexts/AdminContext";
import Alert from "@/router/Shop/Alert";

const Page = () => {
  const { reviews, setReviews } = useAdminState(null);
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
          setReviews(data.data[0].reviews);
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
      }/api/v1/views/delete-reviews-views/${id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setReviews(reviews.filter((review) => review._id !== id));
        setAlert({errType:"danger", errMsg:"Delete Sucessfully", isError: true});
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({errType:"danger", errMsg:"something went wrong", isError: true});
      });
  };

  if (!reviews) return <Loader />;

  return (
    <>
    {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
    <Switch>
      <Route path={match.path + "/new"}>
        <AddReview />
      </Route>
      <Route path={match.path + "/:id"}>
        <EditReview />
      </Route>
      <Route path={match.path}>
        <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
          <div>
            <h1 className="text-3xl font-medium">Customer Reviews</h1>
          </div>
          <div>
            <Link to={match.path + "/new"}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className="whitespace-nowrap w-max text-white !p-3 !bg-indigo-500 hover:!bg-indigo-600 !rounded-md"
              >
                Add Review
              </Button>
            </Link>
          </div>
        </div>

        <Grid container spacing={2}>
          {reviews.map((review, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  style={{
                    flex: "1 0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Avatar
                          alt={review.name}
                          src={review.image}
                          sx={{ width: 56, height: 56 }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="h6">{review.name}</Typography>
                        <Rating
                          name="read-only"
                          value={review.rating}
                          readOnly
                        />
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <Typography variant="body2">{review.reviews}</Typography>
                    </Box>
                  </div>
                  <Grid container gap={1} mt={1} position="static" bottom={0}>
                    <Link to={`${match.path}/${review._id}`}>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ opacity: 0.9 }}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ opacity: 0.9 }}
                      onClick={() => handleDelete(review._id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Route>
    </Switch>
    </>
  );
};

export default Page;
