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
import { useHistory } from 'react-router-dom';


import axios from 'axios';
import OrdersDetails from './OrdersDetails';
import Loader from '@/components/Loader';

const Page = () => {
    const match = useRouteMatch();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);



    const [orders, setOrders] = useState([]);
    const navigateToOrderDetails = (user) => {
        history.push({
            pathname: `${match.path}/ordersdetail`,
            state: { detailData: user }
        });
    };
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(import.meta.env.VITE_APP_BASE_API + '/api/v1/order');
            setOrders(response?.data?.data?.docs);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false); // Stop loading after fetching
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const oderdelevered = async (id) => {
        try {
            const response = await axios.put(import.meta.env.VITE_APP_BASE_API + `/api/v1/order/update-order-status/${id}`);
        
            // Fetch orders again after updating the order status
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };
    if (isLoading) return <Loader />;

    return (
        <>
            <Switch>
                <Route path={match.path + "/ordersdetail"}>
                    <OrdersDetails />
                </Route>

                <Route path={match.path}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='max-w-20 w-20 truncate text-left'>User Name</TableCell>
                                    <TableCell className='max-w-20 w-20 truncate text-left'>User Email</TableCell>
                                    <TableCell className='max-w-20 w-20 truncate text-left'>orderDate</TableCell>
                                    <TableCell className='max-w-20 w-20 truncate text-left'>Items</TableCell>
                                    <TableCell className='max-w-20 w-20 truncate text-left'>Total</TableCell>
                                    <TableCell className='max-w-20 w-20 truncate text-left'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders?.map((user) => (
                                    <TableRow
                                        key={user.userId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" className='max-w-20 w-20 truncate text-left'>
                                            {user.username}
                                        </TableCell>
                                        <TableCell className='max-w-20 w-20 truncate text-left'>{user?.email}</TableCell>
                                        <TableCell className='max-w-20 w-20 truncate text-left'> <div>
                                            Ordered on  {new Date(user?.orderDate).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </div></TableCell>
                                        <TableCell  className='max-w-20 w-20 truncate text-left' >{user?.products?.length}</TableCell>
                                        <TableCell  className='max-w-20 w-20 truncate text-left' >{user?.subTotal}</TableCell>
                                        <TableCell  className='max-w-20 w-20 truncate text-left' >
                                            {user?.status === "pending" &&
                                                <Button onClick={() => oderdelevered(user?._id)}>delivered</Button>
                                            }
                                            <Button onClick={() => navigateToOrderDetails(user)}>Details</Button>
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