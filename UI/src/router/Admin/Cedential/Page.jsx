import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAdminState } from '@/contexts/AdminContext';
import Alert from '@/router/Shop/Alert';

const Page = () => {
  const [credentials, setCredentials] = useState({
    stripePublishableKey: "your_publishabrwetle_key",
    stripeSecretKey: "your_secret_key",
    stripeEndpointSecret: "your_endpoint_fffffffffffffffffffffffffsecret",
    sendEmail: "your_send_em333333333333333ail",
    sendEmailPassword: "your_send_email_password",
    hostEmail: "your_host_email",

  });

 const { setAlert, alert } = useAdminState();
 useEffect(() => {
  fetchCredentials();
}, []);

const fetchCredentials = () => {
  fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/credentials')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {

        const { stripePublishableKey, stripeSecretKey, stripeEndpointSecret, sendEmail, sendEmailPassword, hostEmail } = data.data;
        setCredentials({ stripePublishableKey, stripeSecretKey, stripeEndpointSecret, sendEmail, sendEmailPassword, hostEmail });
        setAlert({ errType: 'success', errMsg: 'Credentials updated successfully', isError: false });
      } else {
        setAlert({ errType: 'error', errMsg: 'Failed to update credentials', isError: true });
      }
    })
    .catch((error) => {
      console.error('Error fetching credentials:', error);
      setAlert({ errType: 'error', errMsg: 'Failed to fetch credentials', isError: true });
    });
};
 const updateBenchmark = () => {
  fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/credentials', {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(credentials),
  })
     .then((response) => response.json())
     .then(({ data }) => {
      const { stripePublishableKey, stripeSecretKey, stripeEndpointSecret, sendEmail, sendEmailPassword, hostEmail } = data;
      setCredentials({ stripePublishableKey, stripeSecretKey, stripeEndpointSecret, sendEmail, sendEmailPassword, hostEmail });

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
    <Typography variant="h5">Credentials</Typography>
    <TextField
      variant="outlined"
      margin="normal"
      fullWidth
      id="stripePublishableKey"
      label="Stripe Publishable Key"
      name="stripePublishableKey"
      type="text"
      value={credentials.stripePublishableKey || ''}
      onChange={(e) => setCredentials({ ...credentials, stripePublishableKey: e.target.value })}
    />
    <TextField
      variant="outlined"
      margin="normal"
      fullWidth
      id="stripeSecretKey"
      label="Stripe Secret Key"
      name="stripeSecretKey"
      type="text"
      value={credentials.stripeSecretKey || ''}
      onChange={(e) => setCredentials({ ...credentials, stripeSecretKey: e.target.value })}
    />
    <TextField
      variant="outlined"
      margin="normal"
      fullWidth
      id="stripeEndpointSecret"
      label="Stripe Endpoint Secret"
      name="stripeEndpointSecret"
      type="text"
      value={credentials.stripeEndpointSecret || ''}
      onChange={(e) => setCredentials({ ...credentials, stripeEndpointSecret: e.target.value })}
    />
    <TextField
      variant="outlined"
      margin="normal"
      fullWidth
      id="sendEmail"
      label="Send Email"
      name="sendEmail"
      type="text"
      value={credentials.sendEmail || ''}
      onChange={(e) => setCredentials({ ...credentials, sendEmail: e.target.value })}
    />
    <TextField
      variant="outlined"
      margin="normal"
      fullWidth
      id="sendEmailPassword"
      label="Send Email Password"
      name="sendEmailPassword"
      type="password"
      value={credentials.sendEmailPassword || ''}
      onChange={(e) => setCredentials({ ...credentials, sendEmailPassword: e.target.value })}
    />
    <TextField
      variant="outlined"
      margin="normal"
      fullWidth
      id="hostEmail"
      label="Host Email"
      name="hostEmail"
      type="text"
      value={credentials.hostEmail || ''}
      onChange={(e) => setCredentials({ ...credentials, hostEmail: e.target.value })}
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

export default Page