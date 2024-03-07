import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import EditdimensionWeight from "./EditdimensionWeight"
import Adddimensionweight from './Adddimensionweight';
import { Add as AddIcon } from "@mui/icons-material";
import Loader from '@/components/Loader';

const Page = () => {
  const match = useRouteMatch();
  const [isLoading, setIsLoading] = useState(true);
  const [dimensionWeight, setdimensionWeightWeight] = useState([]);
  const location = useLocation()
  const fetchReviews = () => {
    setIsLoading(true);
    fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/dimensions/get-product-weight-range-dimension")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setdimensionWeightWeight(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      }).finally(() => {
        setIsLoading(false); // Stop loading after fetching
      });
  };
  useEffect(() => {
    fetchReviews();
  }, [location]);
  if (isLoading) return <Loader />;
  return (
    <>
      <Switch>
        <Route path={match.path + "/adddimensionweight"}>
          <Adddimensionweight />
        </Route>
        <Route path={match.path + "/:id"}>
          <EditdimensionWeight />
        </Route>
        <Route path={match.path}>
          <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
            <div>
              <h1 className="text-3xl font-medium">Dimension</h1>
            </div>
            <div>
              <Link to={match.path + "/adddimensionweight"}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  className="whitespace-nowrap w-max text-white !p-3 !bg-indigo-500 hover:!bg-indigo-600 !rounded-md"
                >
                  Add
                </Button>
              </Link>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className='max-w-20 w-20 truncate text-left' >Dimension</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left' >length</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left' >width</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left' >height</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left' >weight_range</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left' >Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dimensionWeight?.map((data) => (
                  <TableRow
                    key={data.userId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell className='max-w-20 w-20 truncate text-left' component="th" scope="row" >
                      {data.dimensions}
                    </TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{data?.length}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{data?.width}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{data?.height}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{data?.weight_range}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to={`${match.path}/${data._id}`}>
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
                          color="primary"
                          style={{ opacity: 0.9 }}
                          onClick={() => {
                            setIsLoading(true);
                            fetch(import.meta.env.VITE_APP_BASE_API + `/api/v1/dimensions/weight-range/${data._id}`, {
                              method: 'DELETE',
                            })
                              .then(response => response.json())
                              .then(data => {
                                fetchReviews();
                              })
                              .catch((error) => {
                                console.error('Error:', error);
                              }).finally(() => {
                                setIsLoading(false);
                              });
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Route>
      </Switch>
    </>
  )
}

export default Page