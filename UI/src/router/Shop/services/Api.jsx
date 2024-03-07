import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_BASE_API + '/api/v1';
const token = localStorage.getItem('token');

// export const fetchData = async (endpoint) => {
//     const response = await fetch(`${apiUrl}/${endpoint}`);
//     const data = await response.json();
//     return data;
// };

export const getshowingdata = async (endpoint) => {
  const response = await axios.get(`${apiUrl}/${endpoint}`, {
     mode: 'cors',
     headers: {
       "Content-Type": "application/json"
     }
  });
  return response.data;
 };

export const fetchData = async (endpoint, params = {}) => {
  const url = new URL(`${apiUrl}/${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url, {
    method: 'GET', 
    mode: 'cors',
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return data;
};


export const addtocart = async(data) =>{
  const response = await axios.post(`${apiUrl}/products/add-to-cart`, data, {
     headers: {
       'Authorization': `Bearer ${token}`,
       "Content-Type": "application/json"
     },
     mode: 'cors'
  })
  return response;
 }


