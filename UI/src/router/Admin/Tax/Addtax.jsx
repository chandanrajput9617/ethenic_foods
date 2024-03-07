import React, { useEffect, useState } from 'react'
import { Paper, Typography } from '@mui/material';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";


const Addtax = () => {
  const [formData, setFormData] = useState({
    stateCode: '',
    stateTaxRate: ''
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
        const response = await fetch(import.meta.env.VITE_APP_BASE_API + '/api/v1/tax', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log(data,"datattttt");
        setFormData(
            {
                "stateCode": "",
                "stateTaxRate": ""
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
                                name="stateCode"
                                label="stateCode"
                                value={formData.stateCode}
                                fullWidth
                                onChange={handleChange}
                            />
                        </Grid>
              
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="stateTaxRate"
                                label="stateTaxRate"
                                value={formData.stateTaxRate}
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

export default Addtax