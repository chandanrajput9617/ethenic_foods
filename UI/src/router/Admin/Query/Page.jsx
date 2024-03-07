import React, { useEffect, useState } from 'react'
import { Link, Route, useRouteMatch, Switch } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import axios from 'axios';
const Page = () => {
  const [query, setUsers] = useState([]);
  const match = useRouteMatch();

  useEffect(() => {
    // setIsLoading(true);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_APP_BASE_API + '/api/v1/contact-us');
        setUsers(response?.data?.data.contacts);
      } catch (error) {
        console.error('Error fetching query:', error);
      } finally {
        // setIsLoading(false)
      }
    };

    fetchUsers();
  }, []);
  return (
    <>
      {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
      <Switch>
        {/* <Route path={match.path + "/useredit"}>
        <UserEdit /> 
      </Route> */}

        <Route path={match.path}>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className='max-w-20 w-20 truncate text-left'>User Name</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left'>User Email</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left'>Massage</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left' >Actions</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {query?.map((user) => (
                  <TableRow
                    key={user.userId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" className='max-w-20 w-20 truncate text-left'>
                      {user.name}
                    </TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{user.email}</TableCell>
                    <TableCell className='max-w-36 w-36 text-left '>{"hgjijhu uhjkh jkhjhjh jhg gjkfghfg fghf fgh dfh gh fth fgh fgh sy gh hujhuh  uugu gyugy ugy uyg ugy uygu gyuogy ouiyhjg jkgb ui gu gyui yguig yugy ugy ujhy b jkh jhyguj hg ujyhg uiyg uoyg uogyuo gyuo ygj hgujyhg "}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left' >
                 
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ opacity: 0.9 }}
                          onClick={() => {
                            // setIsLoading(true);
                            fetch(import.meta.env.VITE_APP_BASE_API + `/api/v1/contact-us/${user._id}`, {
                              method: 'DELETE',
                            })
                              .then(response => response.json())
                              .then(data => {
                                setUsers(query.filter(item => item._id !== user._id));
                              })
                              .catch((error) => {
                                console.error('Error:', error);
                              }).finally(() => {
                                // setIsLoading(false);
                              });
                          }}
                        >
                          Delete
                        </Button>
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