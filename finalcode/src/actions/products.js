import * as api from "../api";


export const getproducts=()=>async(dispatch)=>{
    try{

            const {data}=await api.fetchproducts();
            dispatch({type:'FETCH_ALL',payload:data});

    }catch(error){
            console.log(error.message);
    }
}
export const createProduct=(values,useremail)=>async(dispatch)=>{
    try{

        console.log(values.productname +' '+ values.shippingmethod);
        const {data}=await api.createProduct({values,useremail})
        dispatch ({type:'CREATE',payload:data});

    }catch(error)
    {
        console.log(error);
    }
}

export const updateproduct=(values,useremail)=>async(dispatch)=>{
    try{

        console.log(values.productname +' '+ useremail);
        const {data}=await api.updateproduct(values,useremail)
        dispatch ({type:'UPDATE',payload:data});

    }catch(error)
    {
        console.log(error);
    }
}

export const deleteinventory=(userid,productid)=>async(dispatch)=>{
    try{

       
        const {data}=await api.deleteinventory(userid,productid);
        dispatch ({type:'DELETE',payload:data});
        return data;

    }catch(error)
    {
        console.log(error);
    }
}

export const seteditinventory=(values)=>async(dispatch)=>{
    try {
        const setdata=values;
        dispatch ({type:'SET_INVEN',setdata});
        
    } catch (error) {
        console.log(error);
    }
}

export const getproductsadmin=()=>async(dispatch)=>{

    try{

        const {data}=await api.getproductsadmin();

        const setdata=data.allorders;

        console.log(setdata);
        

            
        dispatch ({type:'ORDER',setdata});
        return data;
        
       


}
catch(error){
    console.log(error.message);
}
}