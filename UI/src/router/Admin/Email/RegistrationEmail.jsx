import { useAdminState } from "@/contexts/AdminContext";
import { Button, TextField, Box } from "@mui/material";
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RegistrationEmail = ({registrationEmailData}) => {
  const [bannerImage, setBannerImage] = useState(null); // State for the banner image
  const [body, setBody] = useState(registrationEmailData?.body);
  const [subject, setSubject] = useState(registrationEmailData?.subject);
  const {  setAlert, alert } = useAdminState();

  useEffect(() => {
    setSubject(registrationEmailData?.subject);
    setBody(registrationEmailData?.body);
  }, [registrationEmailData]);
  
  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImage(file);
  };
  const handleBodyChange = (value) => {
    setBody(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bannerImg', bannerImage);
    formData.append('mailType', "registration-confirmation-email"
    );
    formData.append('subject', subject);
    formData.append('body', body);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/mail', {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to send email.');
      }

      setAlert({errType:"success", errMsg:"Submit Sucessfully", isError: true});
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align',
    'color', // Added color format
    'link', 'image'
  ];

  return (
    <Box>
      <div>
        <form onSubmit={handleSubmit}>
          <TextField
            id="bannerImage"
            margin="normal"
            name="image"
            label="Image"
            type="file"
            accept="image/*"
            onChange={handleBannerImageChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/*" }}
          />

          <div>
            <TextField
              id="subject"
              type="text"
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div>
            <label htmlFor="body">Body:</label>
            <ReactQuill
              id="body"
              value={body}
              onChange={handleBodyChange}
              modules={modules}
              formats={formats}
            />
          </div>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            Submit
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default RegistrationEmail;
