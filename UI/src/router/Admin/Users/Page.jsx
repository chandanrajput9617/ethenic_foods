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
import UserEdit from './UserEdit';
import { useHistory } from 'react-router-dom';
import Loader from '@/components/Loader';
import Alert from '@/router/Shop/Alert';
import { useAdminState } from '@/contexts/AdminContext';



const Page = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true); 
  const [users, setUsers] = useState([]);
  const {  setAlert, alert } = useAdminState();

  useEffect(() => {
    setIsLoading(true);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_APP_BASE_API + '/api/v1/users/get-users?limit=50');
        setUsers(response?.data?.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }finally{
        setIsLoading(false)
      }
    };

    fetchUsers();
  }, []);
  const navigateToOrderDetails = (user) => {
    history.push({
        pathname: `${match.path}/useredit`,
        state: { detailData: user }
    });
};  
if (isLoading) return <Loader />;
return (
    <>
          {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
      <Switch>
      <Route path={match.path + "/useredit"}>
        <UserEdit /> 
      </Route>

        <Route path={match.path}>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className='max-w-20 w-20 truncate text-left'>User Name</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left'>User Email</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left'>Country</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left'>State</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left'>City</TableCell>
                  <TableCell className='max-w-20 w-20 truncate text-left'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow
                    key={user.userId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" className='max-w-20 w-20 truncate text-left'>
                      {user.username}
                    </TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{user.email}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{user.country}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{user.state}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>{user.city}</TableCell>
                    <TableCell className='max-w-20 w-20 truncate text-left'>
                                                <Button onClick={() => navigateToOrderDetails(user)}>Edit</Button>
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