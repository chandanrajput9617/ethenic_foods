import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAdminState } from '@/contexts/AdminContext';
import Alert from '@/router/Shop/Alert';

const Page = () => {
 const [socialMedia, setSocialMedia] = useState({
    facebook: { link: '' },
    twitter: { link: '' },
    instagram: { link: '' },
    linkedin: { link: '' },
    youtube: { link: '' },
    pinterest: { link: '' },
    snapchat: { link: '' },
    tiktok: { link: '' },
 });
 const { setAlert, alert } = useAdminState();
 useEffect(() => {
  fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/social-media-link')
     .then((response) => response.json())
     .then((data) => {
       const { facebook, twitter, instagram, linkedin, youtube, pinterest, snapchat, tiktok } = data.data;
       setSocialMedia({ facebook, twitter, instagram, linkedin, youtube, pinterest, snapchat, tiktok });
     })
     .catch((error) => {
       console.error('Error fetching social media links:', error);
     });
 }, []);

 const updateBenchmark = () => {
  fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/social-media-link', {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(socialMedia ),
  })
     .then((response) => response.json())
     .then(({ data }) => {

      const { facebook, twitter, instagram, linkedin, youtube, pinterest, snapchat, tiktok } = data;
      setSocialMedia({ facebook, twitter, instagram, linkedin, youtube, pinterest, snapchat, tiktok });
      setAlert({ errType: 'success', errMsg: 'Update Successfully', isError: true });
     })
     .catch((error) => {
       console.error('Error updating social media links:', error);
     });
 };
 return (
  <>
  {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}

    <Box display="flex" flexDirection="column" rowGap={4}>
      <Paper style={{ width: '100%', padding: '16px' }}>
        <Typography variant="h5">Social Media Links</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="facebook"
          label="Facebook"
          name="facebook"
          type="text"
          value={socialMedia.facebook.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, facebook: { link: e.target.value } })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="twitter"
          label="Twitter"
          name="twitter"
          type="text"
          value={socialMedia.twitter.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, twitter: { link: e.target.value } })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="instagram"
          label="Instagram"
          name="instagram"
          type="text"
          value={socialMedia.instagram.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, instagram: { link: e.target.value } })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="linkedin"
          label="LinkedIn"
          name="linkedin"
          type="text"
          value={socialMedia.linkedin.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: { link: e.target.value } })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="youtube"
          label="YouTube"
          name="youtube"
          type="text"
          value={socialMedia.youtube.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, youtube: { link: e.target.value } })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="pinterest"
          label="Pinterest"
          name="pinterest"
          type="text"
          value={socialMedia.pinterest.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, pinterest: { link: e.target.value } })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="snapchat"
          label="Snapchat"
          name="snapchat"
          type="text"
          value={socialMedia.snapchat.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, snapchat: { link: e.target.value } })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="tiktok"
          label="TikTok"
          name="tiktok"
          type="text"
          value={socialMedia.tiktok.link || ''}
          onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: { link: e.target.value } })}
        />
        <Button
          variant="contained"
          className="!bg-indigo-500 hover:!bg-indigo-600 text-white mt-2"
          onClick={updateBenchmark}
        >
          Update
        </Button>
      </Paper>
    </Box>
    </>
 );
};

export default Page;