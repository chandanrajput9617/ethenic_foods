import { useAdminState } from "@/contexts/AdminContext";
import {
  Button,
  TextField,
  Box,
  Rating,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import { useState } from "react";

const AddReview = () => {
  const [review, setReview] = useState({
    name: "",
    rating: 0,
    reviews: "",
    reviews_image: null,
    age: "",
  });
  const {setAlert } = useAdminState();
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    setReview((review) => ({
      ...review,
      reviews_image: event.target.files[0],
    }));

    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const handleChange = (event) => {
    setReview((review) => ({
      ...review,
      [event.target.name]:
        event.target.name === "rating"
          ? +event.target.value
          : event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Submit the review...
    // return;
    const formData = new FormData();

    Object.keys(review).forEach((key) => {
      formData.append(key, review[key]);
    });

    try {
      const response = await fetch(
        import.meta.env.VITE_APP_BASE_API +
          "/api/v1/views/create-reviews-views",
        {
          method: "POST",
          body: formData,
        }
      );
      setReview({
        name: "",
        rating: 0,
        reviews: "",
        reviews_image: null,
        age: "",
      })
      
      if (!response.ok) {
        const data = await response.json();
        setAlert({errType:"danger", errMsg:data?.error, isError: true});    
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // setReview({
      //   name: "",
      //   rating: 0,
      //   reviews: "",
      //   image: null,
      // });

      // setPreview(null);
    } catch (error) {
      console.error(error);
    }
  };

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
                  height: 150,
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

export default AddReview;
