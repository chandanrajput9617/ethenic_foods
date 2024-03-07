import React, { useEffect, useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import { Add as AddIcon } from "@mui/icons-material";
import Edittax from './Edittax';
import Addtax from './Addtax';
import Loader from '@/components/Loader';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Alert from '@/router/Shop/Alert';
import { useAdminState } from '@/contexts/AdminContext';

const Page = () => {
  const match = useRouteMatch();
  const [taxes, setTaxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const location = useLocation();
  const {  alert } = useAdminState();

  useEffect(() => {
    const fetchTaxes = () => {
      setIsLoading(true);
      fetch(import.meta.env.VITE_APP_BASE_API + "/api/v1/tax")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setTaxes(data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        }).finally(() => {
          setIsLoading(false); 
        });
    };

    fetchTaxes();
  }, [location]);
  if (isLoading) return <Loader />;

  return (
    <>
    {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
      <Switch>
        <Route path={match.path + "/add"}>
          <Addtax />
        </Route>
        <Route path={match.path + "/:id"}>
          <Edittax />
        </Route>        <Route path={match.path}>
        <div className="w-full py-2 flex justify-between items-center flex-row mb-3">
            <div>
              <h1 className="text-3xl font-medium">Dimension</h1>
            </div>
            <div>
              <Link to={match.path + "/add"}>
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
                  <TableCell align="right">State Code</TableCell>
                  <TableCell align="right">Tax Rate (%)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxes.map((tax) => (
                  <>
                  <TableRow key={tax.state_code}>
                    <TableCell align="right">{tax.state_code}</TableCell>
                    <TableCell align="right">{tax.state_tax_rate}</TableCell>
                    <TableCell align="right">
                      <div style={{ display: 'flex', flexDirection: "row-reverse", gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Link to={`${match.path}/${tax._id}`}>
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ opacity: 0.9 }}
                            >
                              Edit
                            </Button>
                          </Link>
                        </div>
                        <div>
                          <Button
                            variant="contained"
                            color="primary"      
                            style={{ opacity: 0.9 }}
                            onClick={() => {
                              setIsLoading(true);
                              fetch(import.meta.env.VITE_APP_BASE_API +`/api/v1/tax/${tax._id}`, {
                                method: 'DELETE',
                              })
                                .then(response => response.json())
                                .then(data => {
                                  setTaxes(taxes.filter(item => item._id !== data?.data._id));
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
                      </div>
                    </TableCell>
                  </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Route>
      </Switch>
    </>
  );
};

export default Page;