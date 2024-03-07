            
import React, { useEffect, useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from "@mui/material/Button";
import { Add as AddIcon } from "@mui/icons-material";
import Addstate from "./AddShipmentSatae";
import EditShipmentstate from "./EditShipmentstate";
import Loader from '@/components/Loader';
import { useLocation } from 'react-router-dom';

// Define the columns for your table
const columns = [
  { id: 'state', label: 'State', minWidth: 100 },
  { id: 'state_code', label: 'State Code', minWidth: 100 },
  { id: 'postal', label: 'Postal', minWidth: 100 },
  { id: 'shipment_state_rate', label: 'Shipment State Rate', minWidth: 100 },
  { id: 'shipment_delivery_message', label: 'Shipment Delivery Message', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 100 },
];
const styletablecell = {
  "white-space": "nowrap",
  "overflow": "hidden",
  "text-overflow": "ellipsis",
  "max-width": "200px"
}
const Page = () => {
  const match = useRouteMatch();
  const [shipment, setShipment] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true); 
const location = useLocation()
  const fetchReviews = () => {

    setIsLoading(true);
    fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/shipment-rate-state/get-shipment-rate-state")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setShipment(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      }).finally(() => {
        setIsLoading(false); 
      });
  };
  useEffect(() => {

    fetchReviews();
  }, [location]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  if (isLoading) return <Loader/>;

  return (
    <>
      <Switch>
        <Route path={match.path + "/addstate"}>
          <Addstate />
        </Route>
        <Route path={match.path + "/:id"}>
          <EditShipmentstate />
        </Route>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
            <div>
              <h1 className="text-3xl font-medium">Add State</h1>
            </div>
            <div>
              <Link to={match.path + "/addstate"}>
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
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, styletablecell}}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shipment.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={data._id}>
                    {columns.map((column) => {
                      const value = data[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}  style={styletablecell}
                        >
                          {column.id === 'actions' ? (
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
                                  setIsLoading(true)
                                  fetch(import.meta.env.VITE_APP_BASE_API+`/api/v1/shipment-rate-state/${data._id}`, {
                                    method: 'DELETE',
                                  })
                                    .then(response => response.json())
                                    .then(data => {
                                      setShipment(shipment.filter(item => item._id !== data._id));
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
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={shipment.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </Switch>

    </>
  );
};

export default Page;