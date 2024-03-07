import Loader from "@/components/Loader";
import { Grid, Paper, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import AddProduct from "./AddProduct";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdminState } from "@/contexts/AdminContext";
import EditProduct from "./EditProduct";
import Alert from "@/router/Shop/Alert";
const Page = () => {
  const { products, setProducts, setAlert, alert } = useAdminState();
  const [isLoading, setIsLoading] = useState(true);
  const match = useRouteMatch();
  useEffect(() => {
    setIsLoading(true);
    fetch(
      import.meta.env.VITE_APP_BASE_API +
      "/api/v1/products/get-product?limit=40"
    )
      .then((res) => res.json())
      .then(({ data }) => {
        setProducts(data.docs);
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });


  function toggleBestSeller(id, best_seller) {
    fetch(
      `${import.meta.env.VITE_APP_BASE_API
      }/api/v1/products/update-product/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          best_seller: !best_seller,
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
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id
              ? { ...product, best_seller: !best_seller }
              : product
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function deleteProduct(id) {
    fetch(
      `${import.meta.env.VITE_APP_BASE_API
      }/api/v1/products/delete-product/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((deletedProduct) => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        setAlert({ errType: "danger", errMsg: "Delete Sucessfully", isError: true });
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ errType: "danger", errMsg: "Something went wrong", isError: true });

      });
  }
  if (isLoading) return <Loader />;
  return (
    <>
      {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
      <Switch>
        <Route path={match.path + "/new"}>
          <AddProduct />
        </Route>

        <Route path={match.path + "/edit/:id"}>
          <EditProduct />
        </Route>

        <Route path={match.path}>
          <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
            <div>
              <h1 className="text-3xl font-medium">All Products</h1>
            </div>
            <div>
              <Link to={match.path + "/new"}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  className="whitespace-nowrap w-max text-white !p-3 !bg-indigo-500 hover:!bg-indigo-600 !rounded-md"
                >
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
          <Grid container spacing={2}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box height="100%" display="flex">
                  <Paper
                    className={`w-full p-4 space-y-1 ${product.best_seller &&
                      "!bg-indigo-50 !ring-2 ring-indigo-200"
                      } `}
                  >
                    {
                      typeof product.images[0] === "string" ?
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_API}${product.images[0]
                            }`}
                          className="w-full aspect-square object-cover rounded-md"
                        /> : <img
                          key={index}
                          src={
                            URL.createObjectURL(product.images[0])
                          }
                          alt={`Selected ${index}`}
                          className="w-full aspect-square object-cover rounded-md"

                        />
                    }
                    <h2 className="font-bold "style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '20px', marginTop: '13px' }}>{product.title}</h2>
                    <p>
                      <strong>Origin Country: </strong>
                      {product.country?.name}
                    </p>
                    <p>
                      <strong>Price: </strong>
                      {formatter.format(product.price)}
                    </p>
                    <p>
                      <strong>Category: </strong>
                      {product.category?.name}
                    </p>
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap={1}
                      marginBlock={2}
                    >
                      <Link to={`${match.path}/edit/${product._id}`}>
                        <Button
                          startIcon={<EditIcon />}
                          variant="contained"
                          className="text-white p-2 !bg-indigo-500 hover:!bg-indigo-600 rounded-md font-medium w-full"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        className="text-white p-2 !bg-indigo-500 hover:!bg-indigo-600 rounded-md font-medium w-full"
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </Button>
                    </Box>

                    <Button
                      variant="contained"
                      className={`w-full text-white p-2 ${product.best_seller
                        ? "!bg-red-400 hover:!bg-red-500"
                        : "!bg-indigo-400 hover:!bg-indigo-500"
                        } rounded-md font-medium`}
                      onClick={() =>
                        toggleBestSeller(product._id, product.best_seller)
                      }
                    >
                      {product.best_seller
                        ? "Remove best seller"
                        : "Make best seller"}
                    </Button>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Route>
      </Switch>
    </>
  );
};

export default Page;
