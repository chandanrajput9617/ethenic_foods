import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Button, TextField, Box } from "@mui/material";
import { useAdminState } from "@/contexts/AdminContext";

const HeroSection = ({ data }) => {
  const [title, setTitle] = useState(data.title);
  const [subtitle, setSubtitle] = useState(data.subtitle);
  const [image, setImage] = useState(null);
  const {setAlert } = useAdminState();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    if (image) formData.append("hero_section_image", image);

    fetch(
      import.meta.env.VITE_APP_BASE_API +
        "/api/v1/views/update-hero-section-views",
      {
        method: "PUT",
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAlert({errType:"success", errMsg:"successfully submit", isError: true});
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({errType:"danger", errMsg:"something went wrong", isError: true});
      });
  };

  const img = image || data.image;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="title"
        label="Title"
        name="title"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="subtitle"
        label="Subtitle"
        id="subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <TextField
        margin="normal"
        name="image"
        label="Image"
        type="file"
        onChange={handleImageChange}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        inputProps={{ accept: "image/*" }}
      />

      {img && (
        <Box
          component={"img"}
          src={
            img == data.image
              ? import.meta.env.VITE_APP_BASE_API + img
              : URL.createObjectURL(img)
          }
          alt={`Hero image`}
          className="h-56 object-cover rounded-md"
          sx={{ mt: 1 }}
        />
      )}
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default HeroSection;
