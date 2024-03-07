import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminState } from "@/contexts/AdminContext";
import Loader from "@/components/Loader";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import Editor from "@/components/Editor";
import { useHistory } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const { blogs, setBlogs } = useAdminState();
  const [preview, setPreview] = useState(null);
  const [editFields, setEditFields] = useState([]);
  const history = useHistory();
  const {setAlert} = useAdminState();


  const addToEditFields = (field) => {
    if (!editFields.includes(field)) setEditFields([...editFields, field]);
  };

  useEffect(() => {
    const fetchBlog = () => {
      fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/views/get-views")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setBlog(data.data[0].blog);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const blog = blogs.find((blog) => blog._id === id);

    if (blog) {
      setBlog(blog);
      setPreview(import.meta.env.VITE_APP_BASE_API + blog.image);
    } else {
      fetchBlog();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, blogs]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setBlog((blog) => ({
      ...blog,
      blog_image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // make a put request to edit the blogs
    const formData = new FormData();
    editFields.forEach((key) => {
      formData.append(key, blog[key]);
    });

    try {
      const response = await fetch(
        import.meta.env.VITE_APP_BASE_API +
          "/api/v1/views/update-blog-views/" +
          id,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();
      setAlert({errType:"success", errMsg:"Edit Sucessfully", isError: true});
      const editedBlog = data.blog.find((blog) => blog._id === id);
      setBlogs((blogs) => {
        const index = blogs.findIndex((blog) => blog._id === id);
        blogs[index] = editedBlog;
        return blogs;
      });

      history.push("/admin/blogs");
    } catch (error) {
      console.error(error);
    }
  };

  if (!blog) return <Loader />;

  return (
    <Paper className="w-full p-4 space-y-1">
      <Typography variant="h5" gutterBottom marginBottom={"20px"}>
        Create New Blog
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              component={Editor}
              content={blog.content}
              setContent={(content) => {
                addToEditFields("content");
                setBlog({ ...blog, content });
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="blog_image"
              label="Image"
              type="file"
              onChange={(e) => {
                addToEditFields("blog_image");
                handleImageChange(e);
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/*" }}
            />
          </Grid>
          {preview && (
            <Grid item xs={6}>
              <Box
                sx={{
                  width: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={preview} alt="preview" />
              </Box>
            </Grid>
          )}

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

export default EditBlog;
