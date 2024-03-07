import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { TextField, Button, Paper, Grid } from '@mui/material';

const Edittax = () => {
    const { id } = useParams();
    const [taxData, setTaxData] = useState(null);
    const [editFields, setEditFields] = useState([]);
    const ignoredKeys = ["_id", "__v","createdAt","latitude","longitude","updatedAt"]; 
    const history = useHistory();
    
  
    const addToEditList = (name) => {
      if (!editFields.includes(name)) {
        setEditFields([...editFields, name]);
      }
    };           
    useEffect(() => {
      const fetchTaxData = async () => {
          try {
            const response = await fetch(import.meta.env.VITE_APP_BASE_API+"/api/v1/tax");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const filteredData = data?.data?.find(item => item._id === id);
            setTaxData(filteredData);
          } catch (error) {
            console.error("Error:", error);
          }
         };
  
      fetchTaxData();
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      addToEditList(name);
      setTaxData({ ...taxData, [name]: value });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = {};
      editFields.forEach((key) => {
        if (key === 'state_code') {
           data['stateCode'] = taxData['state_code'];
        } else if (key === 'state_tax_rate') {
           data['stateTaxRate'] = taxData['state_tax_rate'];
        } else {
           data[key] = taxData[key];
        }
       });
     
      try {     
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_API}/api/v1/tax/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        history.push('/admin/tax');
      } catch (error) {
        console.error(error);
      }
    };
  
    if (!taxData) {
      return <div>Loading...</div>;
    }
    return (
      <Paper className="w-full p-4 space-y-1">
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {Object.keys(taxData).map((key) => (
          !ignoredKeys.includes(key) && (
            <Grid item xs={12} key={key}>
              <TextField
                name={key}
                label={key}
                value={taxData[key]}
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
}

export default Edittax