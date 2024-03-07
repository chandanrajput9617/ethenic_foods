import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Grid, Paper, Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Alert from "../../Shop/Alert"
import Loader from "@/components/Loader";
import { useAdminState } from "@/contexts/AdminContext";

const Page = () => {
  const match = useRouteMatch();
  const [bestSellers, setBestSellers] = useState(null);
  const {setAlert , alert} = useAdminState();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    async function fetchData() {
       try {
         const result = await fetch(
           import.meta.env.VITE_APP_BASE_API +
             "/api/v1/products/get-best-seller-product",
           {
             headers: {
               "Content-Type": "application/json"
             },
             mode: 'cors'
           }
         );
         if (!result.ok) {
           throw new Error(`HTTP error! status: ${result.status}`);
         }
         const { data } = await result.json();
         setBestSellers(data);
       } catch (e) {
         console.error("Error:", e);
       }
    }
   
    fetchData();
   }, []);
  function rmFromBestSeller(id) {
    fetch(
      `${
        import.meta.env.VITE_APP_BASE_API
      }/api/v1/products/update-product/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          best_seller: false,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((updatedProduct) => {
        setBestSellers((prevProducts) =>
          prevProducts.filter((product) => product.product._id !== id)
        );
        setAlert({errType:"success", errMsg:"Remove Sucessfully", isError: true});
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  if (!bestSellers) return <Loader />;
  return (
    
    <>
        {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
      <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
        <div>
          <h1 className="text-3xl font-medium">Best seller products</h1>
        </div>
        <div>
          <p className="text-xl">{bestSellers?.length} Products</p>
        </div>
      </div>
      <Grid container spacing={2}>
        {bestSellers.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box height="100%" display="flex">
              <Paper
                className={`w-full p-4 space-y-1 ${
                  product.product?.best_seller && "!bg-indigo-50 !ring-2 ring-indigo-200"
                } `}
              >
                <img
                  src={`${import.meta.env.VITE_APP_BASE_API}${
                    product.product?.images[0]
                  }`}
                  className="w-full aspect-square object-cover rounded-md"
                />

                <h2 className="font-bold">{product.product?.title}</h2>

                <p>
                  <strong>Price: </strong>
                  {formatter.format(product.product?.price)}
                </p>
                <p>
                  <strong>Category: </strong>
                  {product.product?.category.name}
                </p>

                <Button
                  variant="contained"
                  className="w-full text-white p-2 !bg-red-500 hover:!bg-red-600 rounded-md font-medium"
                  onClick={() => rmFromBestSeller(product.product?._id)}
                >
                  Remove best seller
                </Button>
              </Paper>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Page;
