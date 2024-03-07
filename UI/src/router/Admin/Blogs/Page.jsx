import Loader from "@/components/Loader";
import { Add as AddIcon } from "@mui/icons-material";
import { useEffect } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";

import { useAdminState } from "@/contexts/AdminContext";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import DOMPurify from "dompurify";
import AddBlog from "./AddBlog";
import EditBlog from "./EditBlog";
import Alert from "@/router/Shop/Alert";

const Page = () => {
  const { blogs, setBlogs } = useAdminState();
  const {setAlert,alert } = useAdminState();
  const match = useRouteMatch();

  useEffect(() => {
    const fetchReviews = () => {
      fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/views/get-views", {
         headers: {
           "Content-Type": "application/json"
         },
         mode: 'cors'
      })
         .then((response) => {
           if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
           }
           return response.json();
         })
         .then((data) => {
           setBlogs(data.data[0].blog);
         })
         .catch((error) => {
           console.error("Error:", error);
         });
     };

    fetchReviews();
  }, []);

  const handleDelete = (id) => {
    fetch(
       import.meta.env.VITE_APP_BASE_API +
         "/api/v1/views/delete-blog-views/" +
         id,
       {
         method: "DELETE",
         headers: {
           "Content-Type": "application/json"
         },
         mode: 'cors'
       }
    )
       .then((response) => {
         setAlert({errType:"danger", errMsg:"Delete Sucessfully", isError: true});
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
         return response.json();
       })
       .then(({ data }) => {
         setBlogs(blogs.filter((blog) => blog._id !== id));
       })
       .catch((error) => {
         console.error("Error:", error);
       });
   };

  if (!blogs) return <Loader />;

  return (
    <>
    {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
    <Switch>
      <Route path={match.path + "/new"}>
        <AddBlog />
      </Route>
      <Route path={match.path + "/edit/:id"}>
        <EditBlog />
      </Route>
      <Route path={match.path}>
        <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
          <div>
            <h1 className="text-3xl font-medium">Blogs</h1>
          </div>
          <div>
            <Link to={match.path + "/new"}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className="whitespace-nowrap w-max text-white !p-3 !bg-indigo-500 hover:!bg-indigo-600 !rounded-md"
              >
                New Blog
              </Button>
            </Link>
          </div>
        </div>

        <Grid container spacing={4}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} lg={6} xl={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={import.meta.env.VITE_APP_BASE_API + blog.image}
                  alt="blog image"
                />
                <CardContent
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </Typography>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(blog.content),
                      }}
                    />
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      mt: 1.5,
                      gap: 1.5,
                    }}
                  >
                    <Link to={`${match.path}/edit/${blog._id}`}>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ opacity: 0.9 }}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ opacity: 0.9 }}
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Route>
    </Switch>
    </>
  );
};

export default Page;

// /blog_image-1703419759494-146402194.png
