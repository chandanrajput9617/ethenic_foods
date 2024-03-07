import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { TextField, Button, Paper, Grid } from '@mui/material';

const Editdimension = () => {
    const { id } = useParams();
    const [zipcodeData, setZipcodeData] = useState(null);
    const [editFields, setEditFields] = useState([]);
    const ignoredKeys = ["_id", "__v","createdAt","latitude","longitude","updatedAt"]; 
    const history = useHistory();
  
    const addToEditList = (name) => {
      if (!editFields.includes(name)) {
        setEditFields([...editFields, name]);
      }
    };
    useEffect(() => {
      const fetchZipCodeData = async () => {
          try {
            const response = await fetch(import.meta.env.VITE_APP_BASE_API+"/api/v1/dimensions/get-product-dimension");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const filteredData = data?.data?.find(item => item._id === id);
            setZipcodeData(filteredData);
          } catch (error) {
            console.error("Error:", error);
          }
         };
  
      fetchZipCodeData();
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      addToEditList(name);
      setZipcodeData({ ...zipcodeData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      let jsonData = {};
     
      editFields.forEach((key) => {
         jsonData[key] = zipcodeData[key];
      });
     
      try {
         const response = await fetch(`${import.meta.env.VITE_APP_BASE_API}/api/v1/dimensions/${id}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(jsonData),
         });
     
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
     
         history.push('/admin/dimension');
      } catch (error) {
         console.error(error);
      }
     };
  
    if (!zipcodeData) {
      return <div>Loading...</div>;
    }
    return (
      <Paper className="w-full p-4 space-y-1">
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {Object.keys(zipcodeData).map((key) => (
          !ignoredKeys.includes(key) && (
            <Grid item xs={12} key={key}>
              <TextField
                name={key}
                type="number"
                label={key}
                value={zipcodeData[key]}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          )
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
   </Paper>
    );
  };

export default Editdimension