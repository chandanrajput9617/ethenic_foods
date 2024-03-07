import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Paper, Typography } from '@mui/material';
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Box,
} from "@mui/material"; const AddFreeZipCode = () => {
    const [formData, setFormData] = useState({
        city: '',
        county: '',
        countyAll: '',
        latitude: '',
        longitude: '',
        shipment_delivery_message: '',
        stateCode: '',
        stateName: '',
        zipCode: ''
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
            const response = await fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/free-zip-codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setFormData(  {
                    city: '',
            county: '',
            countyAll: '',
            latitude: '',
            longitude: '',
            shipment_delivery_message: '',
            stateCode: '',
            stateName: '',
            zipCode: ''
        })
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
                                    name="zipCode"
                                    label="zipCode"
                                    value={formData.zipCode}
                                    fullWidth
                                    onChange={handleChange}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="county"
                                    label="county"
                                    value={formData.county}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="stateName"
                                    label="stateName"
                                    value={formData.stateName}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="stateCode"
                                    label="stateCode"
                                    value={formData.stateCode}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="city"
                                    label="city"
                                    value={formData.city}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="shipment_delivery_message"
                                    label="shipment_delivery_message"
                                    value={formData.shipment_delivery_message}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="longitude"
                                    label="longitude"
                                    value={formData.longitude}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="latitude"
                                    label="latitude"
                                    value={formData.latitude}
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
    );
};


export default AddFreeZipCode