import Editor from "@/components/Editor";
import Loader from "@/components/Loader";
import { useAdminState } from "@/contexts/AdminContext";
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
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Alert from "../../Shop/Alert"

const EditProduct = () => {
  const { id } = useParams();
  const { setProducts, products, countries, categories, setAlert } = useAdminState();
  const [product, setProduct] = useState(null);
  const [editedFields, setEditedFields] = useState([]);
  const history = useHistory();
 
  useEffect(() => {
    const prod = products.find((product) => product._id === id);
    if (prod) {
      setProduct(formatProduct(prod));
    } else {
      fetch(
        `${
          import.meta.env.VITE_APP_BASE_API
        }/api/v1/products/get-single-product/${id}`
      )
        .then((res) => res.json())
        .then(({ data }) => {
          setProduct(formatProduct(data));
        });

    }
  }, [id]);

  const addToList = (field) => {
    if (editedFields.includes(field)) return;
    setEditedFields([...editedFields, field]);
  };

  const handleImageChange = (event) => {
    addToList("images");
    setProduct((editProduct) => ({
      ...editProduct,
      images: [...event.target.files],
    }));
  };

  const handleChange = (event) => {
    if (typeof event === "string") {
      setProduct({
        ...product,
        description: event,
      });

      addToList("description");
      return;
    }

    addToList(event.target.name);
    if (event.target.type === "file")
      setProduct({
        ...product,
        [event.target.name]: event.target.files[0],
      });
    else
      setProduct({
        ...product,
        [event.target.name]: event.target.value,
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();

    editedFields.forEach((field) => {
      if (field === "images") {
        product.images.forEach((image) => {
          formData.append("images", image);
        });
      } else {
        formData.append(field, product[field]);
      }
    });

    // return;
    fetch(
      `${
        import.meta.env.VITE_APP_BASE_API
      }/api/v1/products/update-product/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then(({ data }) => {
        product.country = countries.find(
          (country) => country._id === product.origin_country
        );
        if (product.categoryID)
          product.category = categories.find(
            (category) => category._id === product.categoryID
          );
          setAlert({errType:"success", errMsg:"Edit Sucessfully", isError: true});
        setProducts((products) => {
          return products.map((prod) => {
            if (prod._id === data?._id) {
              return product;
            }
            return prod;
          });
        });
        history.push("/admin/products");
      });
  };

  if (!product) return <Loader />;

  return (
    <>

      <Paper className="w-full p-4 space-y-1">
        <Typography variant="h5" gutterBottom marginBottom={"20px"}>
          Create New Products
        </Typography>

        <form onSubmit={handleSubmit} className="!my-4">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="title"
                label="Title"
                value={product.title}
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="origin_country-label" className="bg-white">
                  Origin Country
                </InputLabel>
                <Select
                  labelId="origin_country-label"
                  id="origin_country"
                  name="origin_country"
                  value={
                    typeof product.origin_country === "object"
                      ? product.origin_country._id
                      : product.origin_country
                  }
                  onChange={handleChange}
                >
                  {countries?.map((country, index) => (
                    <MenuItem key={index} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <>
              <Grid item xs={12}>
                <TextField
                  name="short_description"
                  label="Short Description"
                  value={product.short_description}
                  onChange={handleChange}
                  multiline
                  fullWidth
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  value={product.description}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid> */}
              <Grid item xs={12}>
                <Box
                  component={Editor}
                  content={product.description}
                  setContent={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price"
                  value={product.price}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="promotion_code"
                  label="Promotion Code"
                  value={product.promotion_code}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="video"
                  label="Video"
                  type="file"
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: "video/*" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="expiry_date"
                  label="Expiry Date"
                  value={product.expiry_date}
                  type="date"
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="images"
                  label="Images"
                  type="file"
                  onChange={handleImageChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: "image/*", multiple: true }}
                />
              </Grid>
            </>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="categoryID-label" className="bg-white">
                  Category
                </InputLabel>
                <Select
                  labelId="categoryID-label"
                  id="categoryID"
                  name="categoryID"
                  value={
                    product.categoryID
                      ? product.categoryID
                      : product.category._id
                  }
                  onChange={handleChange}
                >
                  {categories?.map((category, index) => (
                    <MenuItem key={index} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {product.images.length > 0 && (
              <Grid item xs={12}>
                <Grid container gap={2}>
                  {Array.from(product.images).map((image, index) => (
                    <img
                      key={index}
                      // src={URL.createObjectURL(image)}
                      src={
                        typeof image === "string"
                          ? import.meta.env.VITE_APP_BASE_API + image
                          : URL.createObjectURL(image)
                      }
                      alt={`Selected ${index}`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
                </Grid>
              </Grid>
            )}
                 <Grid item xs={12} sm={6}>
            <TextField
              name="weight"
              label="Weight"
              value={product.weight}
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="youtube_video_url"
              label="youtube_video_url"
              value={product.youtube_video_url}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
            <Grid item xs={12}>
              <TextField
                name="zipFile"
                label="360 Zip File"
                type="file"
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: ".zip" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="rank"
                label="Rank"
                value={product.rank}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="best_seller-label" className="bg-white">
                  Best Seller
                </InputLabel>
                <Select
                  labelId="best_seller-label"
                  id="best_seller"
                  name="best_seller"
                  value={product.best_seller}
                  onChange={handleChange}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
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
  );
};

function formatProduct(product) {
  product.expiry_date = new Date(product.expiry_date)
    .toISOString()
    .split("T")[0];

  return product;
}

export default EditProduct;
