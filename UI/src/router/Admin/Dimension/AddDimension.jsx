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
} from "@mui/material";

const AddDimension = () => {
    const [formData, setFormData] = useState({
        dimensions: '',
        Height: '',
        Length: '',
        shipment_dimension_price: '',
        Width: ''
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
            const response = await fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/dimensions/create-product-dimension', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setFormData(
                {
                    dimensions: '',
                    Height: '',
                    Length: '',
                    shipment_dimension_price: '',
                    Width: ''
                }
            )
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
                                    name="dimensions"
                                    label="dimension"
                                    value={formData.dimensions}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="Height"
                                    label="height"
                                    value={formData.Height}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="Length"
                                    label="length"
                                    value={formData.Length}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="shipment_dimension_price"
                                    label="shipment_dimension_price"
                                    value={formData.shipment_dimension_price}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="Width"
                                    label="width"
                                    value={formData.Width}
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

export default AddDimension;