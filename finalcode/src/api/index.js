import axios from 'axios';

const API=axios.create({baseURL:"http://localhost:5000"})


API.interceptors.request.use((req)=>{
    if(localStorage.getItem('profile')){
        req.headers.Authorization=`Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }

    return req;
})

export const fetchproducts=()=>API.get('/products');
export const getsellerchat=(value)=>API.get(`/chat/getsellerchat/${value}`);

export const createProduct=(values)=>API.post('/products/createproducts',values);


export const filedisputeseller=(values)=>API.post('/user/filedisputeseller',values);

export const filedisputewarehouse=(values)=>API.post('/warehouse/filedisputewarehouse',values);

export const requestpaymentseller=(values)=>API.post('/user/requestpaymentseller',values);
export const requestpaymentwarehouse=(values)=>API.post('/warehouse/requestpaymentwarehouse',values);


export const signin=(values)=>API.post('/user/signin',values);
export const signup=(values)=>API.post('/user/signup',values);

export const warehousesignin=(values)=>API.post('/warehouse/signin',values);
export const warehousesignup=(values)=>API.post('/warehouse/signup',values);

export const adminsignin=(values)=>API.post('/admin/signin',values);

export const forgotpassword=(values)=>API.post('/user/forgotpassword',values);

export const forgotpasswordwarehouse=(values)=>API.post('/warehouse/forgotpassword',values);

export const resetpassword=(id,token)=>API.get(`/user/resetpassword/${id}/${token}`);
export const setresetpassword=(id,token,values)=>API.post(`/user/setresetpassword/${id}/${token}`,values);

export const resetpasswordwarehouse=(id,token)=>API.get(`/warehouse/resetpassword/${id}/${token}`);
export const setresetpasswordwarehouse=(id,token,values)=>API.post(`/warehouse/setresetpassword/${id}/${token}`,values);

export const getuser=(values)=>API.post('/user/getuser',values);

export const getuserpayments=(values)=>API.post('/user/getuserpayments',values);
export const getwarehousepayments=(values)=>API.post('/warehouse/getwarehousepayments',values);

export const getdisputes=(values)=>API.post('/user/getdisputes',values);
export const getdisputeswarehouse=(values)=>API.post('/warehouse/getdisputeswarehouse',values);

export const answerwarehousedispute=(values)=>API.post('/admin/answerwarehousedispute',values);
export const answersellerdispute=(values)=>API.post('/admin/answersellerdispute',values);

export const getdisputeswarehouseadmin=()=>API.post('/admin/getdisputeswarehouse');
export const getdisputesselleradmin=()=>API.post('/admin/getdisputesseller');

export const getadminuser=(values)=>API.post('/admin/getuser',values);
export const getadminwarehouse=(values)=>API.post('/admin/getwarehouse',values);

export const deactivateSeller=(values)=>API.post('/admin/deactivateseller',values);
export const reactivateSeller=(values)=>API.post('/admin/reactivateseller',values);

export const deactivateWarehouse=(values)=>API.post('/admin/deactivatewarehouse',values);
export const reactivateWarehouse=(values)=>API.post('/admin/reactivatewarehouse',values);


export const getorders=(values)=>API.post('/orders/getorders',values);
export const getordersadmin=()=>API.post('/orders/getordersadmin');
export const getbuyerqueries=()=>API.post('/admin/getbuyerqueries');
export const gettotal=()=>API.post('/admin/gettotal');
export const getproductsadmin=()=>API.post('/products/getproductsadmin');

export const getorder=(values)=>API.post('/orders/getorder',values);
export const shiporderfromseller=(values)=>API.post('/orders/shiporderfromseller',values);
export const getwarehouseuser=(values)=>API.post('/warehouse/getwarehouseuser',values);

export const addsellertowarehouse=(values)=>API.post('/warehouse/addsellertowarehouse',values);

export const removesellerfromwarehouse=(values)=>API.post('/warehouse/removesellerfromwarehouse',values);

export const getwarehouserequest=(values)=>API.get(`/warehouse/getwarehouserequest/${values}`);

export const adduserinwarehouse=(values)=>API.post('/warehouse/addwarehouseuser',values);

export const getwarehouseforuser=(values)=> API.get(`/warehouse/getwarehouseforuser/${values}`);

export const getsellerinwarehouse=(values)=>API.get(`/warehouse/getsellerinwarehouse/${values.sellerid}/${values.warehouseid}`);

export const getsellerinwarehouserequest=(values)=>API.get(`/warehouse/getsellerinwarehouserequest/${values.sellerid}/${values.warehouseid}`);

export const updateuser = (id, values) => API.patch(`/user/updateuser/${id}`, values);

export const updatewarehouseuser = (id, values) => API.patch(`/warehouse/updateuser/${id}`, values);

export const updateproduct = (values,useremail) => API.patch(`/products/updateproduct/${useremail}`,values);
export const setinventory = (values) => API.patch(`/products/setinventory/${values}`);

export const cancelorder = (values) => API.patch(`/orders/cancelorder/`,values);
export const cancelorderseller = (values) => API.patch(`/orders/cancelorderseller/`,values);
export const refundorderseller = (values) => API.patch(`/orders/refundorderseller/`,values);

export const deliverorder = (values) => API.patch(`/orders/deliverorder/`,values);
export const shiporder = (values) => API.patch(`/orders/shiporder/`,values);

export const deleteinventory = (userid,productid) => API.delete(`/products/deleteproduct/${userid}/${productid}`);