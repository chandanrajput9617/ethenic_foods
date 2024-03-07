import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { TextField, Button, Paper, Grid, Typography, Box } from '@mui/material';

const AddShipmentSatae = () => {

   const [formData, setFormData] = useState({
       state_code: '',
       postal: '',
       shipment_delivery_message: '',
       shipment_state_rate: '',
       state: ''
   });

   const handleChange = (event) => {
       setFormData({
           ...formData,
           [event.target.name]: event.target.value
       });
   };

   const handleSubmit = async (event) => {
       event.preventDefault();
       try {                   
           const response = await fetch(import.meta.env.VITE_APP_BASE_API+'/api/v1/shipment-rate-state', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(formData),
           });
           setFormData(
            {
                state_code: '',
                postal: '',
                shipment_delivery_message: '',
                shipment_state_rate: '',
                state: ''
            }
           )
           const data = await response.json();
       } catch (error) {
           console.error('Error submitting form:', error);
       }
   };

 return (
<>
<Paper className="w-full p-4 space-y-1">
               <Typography variant="h5" gutterBottom marginBottom={"20px"}>
                  <form onSubmit={handleSubmit} className="!my-4">
                      <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                              <TextField
                                 name="state_code"
                                 label="State Code"
                                 value={formData.state_code}
                                 fullWidth
                                 onChange={handleChange}
                              />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <TextField
                                 name="postal"
                                 label="Postal"
                                 value={formData.postal}
                                 fullWidth
                                 onChange={handleChange}
                              />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <TextField
                                 name="shipment_delivery_message"
                                 label="Shipment Delivery Message"
                                 value={formData.shipment_delivery_message}
                                 fullWidth
                                 onChange={handleChange}
                              />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <TextField
                                 name="shipment_state_rate"
                                 label="Shipment State Rate"
                                 value={formData.shipment_state_rate}
                                 fullWidth
                                 onChange={handleChange}
                              />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <TextField
                                 name="state"
                                 label="State"
                                 value={formData.state}
                                 fullWidth
                                 onChange={handleChange}
                              />
                          </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                      <Box mt={5}>

                          <Button type="submit" variant="contained">
                            Submit

                          </Button>
                          </Box>

                      </Grid>
                  </form>
               </Typography>
           </Paper>

</>
   )
}

export default AddShipmentSatae