import Loader from "@/components/Loader";
import { useAdminState } from "@/contexts/AdminContext";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import {
  Button,
  TextField,
  Box,
  Rating,
  Paper,
  Typography,
  Grid,
} from "@mui/material";    

const EditReview = () => {
  const { id } = useParams();
  const { reviews, setReviews ,setAlert} = useAdminState();
  const [review, setReview] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editFields, setEditFields] = useState([]);
  const history = useHistory();

  const addToEditList = (name) => {
    if (!editFields.includes(name)) {
      setEditFields([...editFields, name]);
    }
  };

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
          const reviews = data.data[0].reviews;
          const review = reviews.find((review) => review._id === id);
          setReviews(reviews);
          setReview(review);
          setPreview(`${import.meta.env.VITE_APP_BASE_API}/${review.image}`);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const review = reviews.find((review) => review._id === id);

    if (review) {
      setReview(review);
      setPreview(`${import.meta.env.VITE_APP_BASE_API}/${review.image}`);
    } else {
      fetchReviews();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    addToEditList(name);
    if (name === 'age') {
       setReview({ ...review, [name]: Number(value) });
    } else {
       setReview({ ...review, [name]: value });
    }
   };
   

  const handleSubmit = async (e) => {
    e.preventDefault();
    // return;
    const formData = new FormData();

    editFields.forEach((key) => {
      formData.append(key, review[key]);
    });

    try {
      const response = await fetch(
        import.meta.env.VITE_APP_BASE_API +
          "/api/v1/views/update-reviews-views/" +
          id,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();
      const updateReview = data.reviews.find((review) => review._id === id);

      setReviews((reviews) => {
        return reviews.map((review) => {
          if (review._id === id) {
            return updateReview;
          }
          return review;
        });
      });
      setAlert({errType:"success", errMsg:"Edit Successfully", isError: true});
      history.push("/admin/reviews");
    } catch (error) {
      console.error(error);
      setAlert({errType:"danger", errMsg:"something went wrong", isError: true});
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    addToEditList("reviews_image");
    setReview({ ...review, reviews_image: file });
    setPreview(URL.createObjectURL(file));
  };
  if (!review) return <Loader />;
  return (
    <Paper className="w-full p-4 space-y-1">
      <Typography variant="h5" gutterBottom marginBottom={"20px"}>
        Create New Products
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              value={review.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box component="fieldset" borderColor="transparent">
              <Typography variant="body1">Rating</Typography>
              <Rating
                name="rating"
                value={review.rating}
                onChange={handleChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="reviews_image"
              label="Images"
              type="file"
              onChange={handleImageChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/*" }}
            />
          </Grid>
          {preview && (
            <Grid item xs={6}>
              <Box
                sx={{
                  width: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={preview} alt="preview" />
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              name="reviews"
              label="Review"
              value={review.reviews}
              onChange={handleChange}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="age"
              label="Age"
              value={review.age}
              onChange={(e) =>
                setReview((review) => ({ ...review, age: +e.target.value }))
              }
              fullWidth
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditReview;
