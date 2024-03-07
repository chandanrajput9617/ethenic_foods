import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import Editor from "@/components/Editor";
import { useAdminState } from "@/contexts/AdminContext";

const AboutSection = ({ data }) => {
  const [about, setAbout] = useState(data.text);
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const {setAlert } = useAdminState();

  const handleMediaChange = (e, func) => {
    func(e.target.files[0]);
  };


  const img = image || data.image;
  const vid = video || data.video;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here

    const formData = new FormData();

    if (image) formData.append("about_us_image", image);
    if (video) formData.append("about_us_video", video);
    formData.append("text", about);

    fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/views/update-about-us", {
      method: "PUT",
      body: formData,
    })
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
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box component={Editor} content={about} setContent={setAbout} />
      <TextField
        margin="normal"
        name="image"
        label="Image"
        type="file"
        onChange={(e) => handleMediaChange(e, setImage)}
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
          alt={`image`}
          className="w-full object-cover rounded-md"
          sx={{ mt: 1 }}
        />
      )}
      <TextField
        margin="normal"
        name="video"
        label="Video Link"
        type="text"
        value={video || ''} 
        onChange={(e) => setVideo(e.target.value)}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
      />    
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default AboutSection;
