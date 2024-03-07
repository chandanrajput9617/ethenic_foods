import { useEffect, useState } from "react";
import {
 Button,
 FormControl,
 Grid,
 InputLabel,
 MenuItem,
 Paper,
 Select,
 TextField,
 Typography,
 Box,
} from "@mui/material";
import Alert from "@/router/Shop/Alert";
import { useAdminState } from "@/contexts/AdminContext";

const Page = () => {

 const [ShipingRatesState, setShipingRatesState] = useState({
   csvFile: "",
 });
 const [dimensions, setDimensions] = useState({
  csvFile: "",
});
const [dimensionsWeightRange, setDimensionsWeightRange] = useState({
  csvFile: "",
});
const [freezipcode, setFreezipcode] = useState({
  csvFile: "",
});
const [tax, setTax] = useState({
  csvFile: "",
});
const {setAlert,alert } = useAdminState();



 const handleSubmit = async (event) => {
  event.preventDefault();
  if (!ShipingRatesState.csvFile) {
    setAlert({errType:"danger", errMsg:"Please select a file", isError: true});
    return;
 }
  try {
    const formData = new FormData();
    formData.append('csvFile', ShipingRatesState.csvFile);
    const response = await fetch(import.meta.env.VITE_APP_BASE_API+"/api/v1/shipment-rate-state/csv-file-upload",
      {
        method: "POST",
        body: formData,
      }
    );
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAlert({errType:"success", errMsg:"File uploaded successfully", isError: true});
   } catch (error) {
    console.error(error);
    setAlert({errType:"danger", errMsg:"Faild: Please uplode correct file", isError: true});
   }
   
};


const handleDimensions = async (event) => {
  event.preventDefault();
  if (!dimensions.csvFile) {
    setAlert({errType:"danger", errMsg:"Please select a file", isError: true});
    return;
 }
  try {
    const formData = new FormData();
    formData.append('csvFile', dimensions.csvFile);
    const response = await fetch(import.meta.env.VITE_APP_BASE_API+"/api/v1/dimensions/csv-file-upload",
      {
        method: "POST",
        body: formData,
      }
    );
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAlert({errType:"success", errMsg:"File uploaded successfully", isError: true});
   } catch (error) {
    console.error(error);
    setAlert({errType:"danger", errMsg:"Faild: Please uplode correct file", isError: true});
   }
   
};


const handleDimensionsWeightRange = async (event) => {
  event.preventDefault();
  if (!dimensionsWeightRange.csvFile) {
    setAlert({errType:"danger", errMsg:"Please select a file", isError: true});
    return;
 }
  try {
    const formData = new FormData();
    formData.append('csvFile', dimensionsWeightRange.csvFile);
    const response = await fetch(import.meta.env.VITE_APP_BASE_API+"/api/v1/dimensions/csv-file-upload/dimension-weight-range",
      {
        method: "POST",
        body: formData,
      }
    );
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAlert({errType:"success", errMsg:"File uploaded successfully", isError: true});
   } catch (error) {
    console.error(error);
    setAlert({errType:"danger", errMsg:"Faild: Please uplode correct file", isError: true});
   }
   
};
const handleZipcode = async (event) => {
  event.preventDefault();
  if (!freezipcode.csvFile) {
    setAlert({errType:"danger", errMsg:"Please select a file", isError: true});
    return;
 }
  try {
    const formData = new FormData();
    formData.append('csvFile', freezipcode.csvFile);
    const response = await fetch( import.meta.env.VITE_APP_BASE_API +"/api/v1/free-zip-codes/csv-file-upload",
      {
        method: "POST",
        body: formData,
      }
    );
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAlert({errType:"success", errMsg:"File uploaded successfully", isError: true});
   } catch (error) {
    console.error(error);
    setAlert({errType:"danger", errMsg:"Faild: Please uplode correct file", isError: true});
   }
   
};

const handletax = async (event) => {
  event.preventDefault();
  if (!tax.csvFile) {
    setAlert({errType:"danger", errMsg:"Please select a file", isError: true});
    return;
 }
  try {
    const formData = new FormData();
    formData.append('csvFile', tax.csvFile);
    const response = await fetch(import.meta.env.VITE_APP_BASE_API+"/api/v1/tax/csv-file-upload",
      {
        method: "POST",
        body: formData,
      }
    );
   
    if (!response.ok) {
      const data = await response.json();
      setAlert({errType:"danger", errMsg:data?.error, isError: true});  
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
   } catch (error) {
    console.error(error);
    setAlert({errType:"danger", errMsg:"Faild: Please uplode correct file", isError: true});
   }
   
};

return (
<>
{alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
<Paper className="w-full p-4 space-y-1">
<Typography variant="h5" gutterBottom marginBottom={"20px"}>
        Add File for shiping charge
      </Typography>
      <form  onSubmit={handleSubmit}  className="!my-4 mt-5">
      <Grid container spacing={3}>

      <Grid item xs={12}>
            <TextField
              name="csvFile"
              label="Shiping-Rates_State"
              type="file"
              onChange={(e) =>
                setShipingRatesState((prev) => ({ ...prev, csvFile: e.target.files[0] }))
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: ".zip,.csv" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
      </Grid>
      </form>

      <form  onSubmit={handleDimensions}  className="!my-4 mt-5">
      <Grid container spacing={3}>
      <Grid item xs={12}>
            <TextField
              name="csvFile"
              label="Dimensions"
              type="file"
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, csvFile: e.target.files[0] }))

              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: ".csv" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
      </Grid>
      </form>

      <form  onSubmit={handleDimensionsWeightRange}  className="!my-4 mt-5">
      <Grid container spacing={3}>

      <Grid item xs={12}>
            <TextField
              name="csvFile"
              label="DimensionsWeightRange"
              type="file"
              onChange={(e) =>
                setDimensionsWeightRange((prev) => ({ ...prev, csvFile: e.target.files[0] }))
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: ".csv" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
      </Grid>
      
      </form>
      <form  onSubmit={handleZipcode}  className="!my-4 mt-5">

      <Grid container spacing={3}>

<Grid item xs={12}>
      <TextField
        name="csvFile"
        label="free-zip"
        type="file"
        onChange={(e) =>
          setFreezipcode((prev) => ({ ...prev, csvFile: e.target.files[0] }))
        }
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputProps={{ accept: ".csv" }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Grid>
</Grid>
</form>
<form  onSubmit={handletax}  className="!my-4 mt-5">

      <Grid container spacing={3}>
<Grid item xs={12}>
      <TextField
        name="csvFile"
        label="Tax-File"
        type="file"
        onChange={(e) =>
          setTax((prev) => ({ ...prev, csvFile: e.target.files[0] }))
        }
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputProps={{ accept: ".csv" }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Grid>
</Grid>
</form>
</Paper>

</>
    )
}

export default Page