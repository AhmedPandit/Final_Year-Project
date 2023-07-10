import * as api from "../api";

export const signin=(values)=>async(dispatch)=>{

    try {
        const {data}= await api.signin(values);
        const setdata=data.existingUser;
        dispatch ({type:'AUTH',setdata});
        return data;

  

        
    } catch (error) {


        console.log(error)
        
    }

}

export const warehousesignin=(values)=>async(dispatch)=>{

    try {
        const {data}= await api.warehousesignin(values);
        const setdata=data.existingUser;

        dispatch ({type:'WARE_AUTH',setdata});
        return data;

  

        
    } catch (error) {


        console.log(error)
        
    }

}

export const adminsignin=(values)=>async(dispatch)=>{

    try {
        console.log("here")
        const {data}= await api.adminsignin(values);
        const setdata=data.existingUser;

        dispatch ({type:'ADMIN_AUTH',setdata});
        return data;

  

        
    } catch (error) {


        console.log(error)
        
    }

}

export const signup=(values)=>async(dispatch)=>{

    try {

       const {data}= await api.signup(values);

       const setdata=data.result;

        dispatch ({type:'AUTH',setdata});

        return setdata;




      

        
    } catch (error) {

        console.log(error)
        
    }

}

export const warehousesignup=(values)=>async(dispatch)=>{

    try {

        const {data}= await api.warehousesignup(values);

        const setdata=data.result;

        dispatch ({type:'WARE_AUTH',setdata});

        return data;




      

        
    } catch (error) {

        console.log(error)
        
    }

}