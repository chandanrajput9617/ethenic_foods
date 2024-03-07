import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useAdminState } from "@/contexts/AdminContext";

const LoginPageImage = ({ data }) => {
    const [logo, setLogo] = useState(null);
    const {setAlert } = useAdminState();
    const handleLogoChange = (e) => {
      setLogo(e.target.files[0]);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (!logo) {
        setAlert({errType:"danger", errMsg:"Please Select a Logo", isError: true});
        return;
      }
  
      const formData = new FormData();
      formData.append("loginBackgoundImg", logo);
  
      fetch(
        import.meta.env.VITE_APP_BASE_API + "/api/v1/views/update-login-background-image",
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
    
          setAlert({errType:"success", errMsg:"Logo updated successfully", isError: true});
  
        })
        .catch((error) => {
          console.error("Error:", error);
          setAlert({errType:"danger", errMsg:"Something went Wrong", isError: true});
        });
      // Handle form submission here
    };
  
    const img = logo || data;
  
    return (
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          name="image"
          label="Image"
          type="file"
          onChange={(e) => handleLogoChange(e)}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: "image/*" }}
        />
        {img && (
          <Box
            component={"img"}
            src={
              img == data
                ? import.meta.env.VITE_APP_BASE_API + img
                : URL.createObjectURL(img)
            }
            alt={`loginBackgoundImg
            `}
            className="h-56 object-cover rounded-md"
            sx={{ mt: 1 }}
          />
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit
        </Button>
      </Box>
    );
}

export default LoginPageImage