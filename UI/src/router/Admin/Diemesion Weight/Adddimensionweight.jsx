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

const Adddimensionweight = () => {
    const [formData, setFormData] = useState({
        dimensions: '',
        Length: '',
        Width: '',
        Height: '',
        weight_range: ''
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
            const response = await fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/dimensions/create-product-weight-range-dimension', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setFormData(
                {
                    "dimensions": "",
                    "Length": "",
                    "Width": "",
                    "Height": "",
                    "weight_range": ""
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
                                    label="dimensions"
                                    value={formData.dimensions}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="Length"
                                    label="Length"
                                    value={formData.Length}
                                    fullWidth
                                    onChange={handleChange}
                                    type="number"

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="Width"
                                    label="Width"
                                    value={formData.Width}
                                    fullWidth
                                    onChange={handleChange}
                                    type="number"

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="Height"
                                    label="Height"
                                    value={formData.Height}
                                    fullWidth
                                    onChange={handleChange}
                                    type="number"

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="weight_range"
                                    label="weight_range"
                                    value={formData.weight_range}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box mt={2}>
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

export default Adddimensionweight;