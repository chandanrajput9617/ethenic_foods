import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, TextField, Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Typography from "@mui/material/Typography";
import 'react-quill/dist/quill.snow.css';
import OrderConfirmationEmail from "./OrderConfirmationEmail";
import RegistrationEmail from "./RegistrationEmail";
import QueryAdminEmail from "./CustomerQueryAdminEmail"
import QueryUserEmail from "./CustomerQueryEmail"
import Alert from "@/router/Shop/Alert";
import { useAdminState } from "@/contexts/AdminContext";
import ResetPasswordEmail from "./ResetPasswordEmail";




const Page = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/mail');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data?.data);
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    // Call the function to fetch data
    fetchData();
  }, []);
  const {setAlert, alert } = useAdminState();
  const registrationEmailData = data?.find(item => item.mailType === 'registration-confirmation-email');
  const OrderEmailData = data?.find(item => item.mailType === 'order-confirmation-email');
  const UserQuery = data?.find(item => item.mailType === 'customer-query-email');
  const AdminQuery = data?.find(item => item.mailType === 'customer-query-admin-email');
  const ResetPassword = data?.find(item => item.mailType === 'reset-password-email');





  return (
    <>
          {alert.isError && <Alert type={alert.errType} message={alert.errMsg} />}
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography fontSize="24px">Registration-Email-Formate</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RegistrationEmail registrationEmailData={registrationEmailData} />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography fontSize="24px">Order-Confirmation-Email
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OrderConfirmationEmail OrderEmailData={OrderEmailData} />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography fontSize="24px">Query-User-Email
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <QueryUserEmail UserQuery={UserQuery}/>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography fontSize="24px">Query-Admin-Email

          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <QueryAdminEmail AdminQuery={AdminQuery}/>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography fontSize="24px">Reset-Password-Email

          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ResetPasswordEmail ResetPassword={ResetPassword}/>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Page