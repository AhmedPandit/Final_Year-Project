import * as api from "../api";


export const getwarehouseuser=(values)=>async(dispatch)=>{
    try{
            
            const {data}=await api.getwarehouseuser(values);
            const setdata=data;

            
            dispatch ({type:'WARE_AUTH',setdata});
            return data;

    }catch(error){
            console.log(error.message);
    }
}

export const getwarehouseforuser=(values)=>async(dispatch)=>{
    try{

            const {data}=await api.getwarehouseforuser(values);
            console.log(data)
            dispatch({type:'FETCH_WARE_Data',payload:data});
            return data;

    }catch(error){
            console.log(error.message);
    }
}

export const adduserinwarehouse=(values)=>async(dispatch)=>{
    try{

        const {data}=await api.adduserinwarehouse(values);
        console.log(data)
        dispatch({type:'ADD_WARE_Data',payload:data});
        return data;

            
    }catch(error){
            console.log(error.message);
    }
}




    
export const getwarehouserequest=(values)=>async(dispatch)=>{
        try{
    
        
                const {data}=await api.getwarehouserequest(values);
                
                dispatch({type:'FETCH_WARE_SELLER_DATA',payload:data});

                console.log(data);

                return data;
    
        }catch(error){
                console.log(error.message);
        }
    }

export const addsellertowarehouse=(values)=>async(dispatch)=>{

        try{
                
                console.log(values);
                const {data}=await api.addsellertowarehouse(values);
                
                dispatch({type:'ADD_SELLER',payload:data});

                console.log(data);

                return data;
            
    
                
        }catch(error){
                console.log(error.message);
        }
    }

export const getsellerinwarehouse=(values)=>async(dispatch)=>{

        try {
                
                const {data}=await api.getsellerinwarehouse(values);

                
                dispatch({type:'GET_SELLER',payload:data});

                console.log(data);

                return data;
                
                
        } catch (error) {

                console.log(error.message);
                
        }
}

export const getsellerinwarehouserequest=(values)=>async(dispatch)=>{

        try {
                
                const {data}=await api.getsellerinwarehouserequest(values);
                
                
                dispatch({type:'GET_SELLER',payload:data});

                console.log(data);

                return data;
                
                
        } catch (error) {

                console.log(error.message);
                
        }
}


export const removesellerfromwarehouse=(values)=>async(dispatch)=>{

        try {
                
                const {data}=await api.removesellerfromwarehouse(values);
                
                dispatch({type:'REMOVE_SELLER',payload:data});

               
                
        } catch (error) {

                console.log(error.message);
                
        }
}

export const setinventory=(values)=>async(dispatch)=>{
        try{

                
                console.log("here");
                const data= await api.setinventory(values);
                console.log(data);
                return data;


        }
        catch (error) {

                console.log(error.message);
                
        }
}

export const updatewarehouseuser = (id, values) => async (dispatch) => {
        try {
         
          const { data } = await api.updatewarehouseuser(id, values);

          const setdata=data.result;
          console.log(setdata);
          dispatch({ type: 'WARE_AUTH',setdata });
          return setdata;
        } catch (error) {
          console.log(error);
        }
      };
export const forgotpasswordwarehouse= (values) => async (dispatch) => {
        try {

        console.log(values);

         
          const { data } = await api.forgotpasswordwarehouse(values);
      
          return (data.status);

        } catch (error) {
          console.log(error);
        }
      };

export const resetpassword = (id,token) => async (dispatch) => {


        try {

                const { data } = await api.resetpasswordwarehouse(id,token);

                dispatch({ type: 'RESET_PASS', payload: data });

                return data;


         

        } catch (error) {
          console.log(error);
        }
      };


export const setresetpassword = (id,token,values) => async (dispatch) => {



        try {

                const { data } = await api.setresetpasswordwarehouse(id,token,values);

                dispatch({ type: 'SET_RESET_PASS', payload: data });

                return data;


         

        } catch (error) {
          console.log(error);
        }
      };
      
      
      
      
      

      
    export const filedisputewarehouse=(values)=>async(dispatch)=>{
        try{
                
      
          const {data}=await api.filedisputewarehouse({values})
          console.log(data);
          return data;
    
        }catch(error){
                console.log(error.message);
        }
    }


    export const getdisputeswarehouse=(values)=>async(dispatch)=>{
        try{
                
                const {data}=await api.getdisputeswarehouse(values);
      
                const setdata=data;
      
                 console.log(setdata);
                dispatch ({type:'WAREHOUSE_DISPUTES',setdata});
                return data;
      
        }catch(error){
                console.log(error.message);
        }
      }


      export const requestpaymentwarehouse=(values)=>async(dispatch)=>{
        try{
                
          
    
          console.log(values);
          const {data}=await api.requestpaymentwarehouse({values})
          console.log(data);
          return data;
    
        }catch(error){
                console.log(error.message);
        }
    }
    export const getwarehousepayments=(values)=>async(dispatch)=>{
      try{
              
        console.log(values);
        const {data}=await api.getwarehousepayments({values})
        console.log(data);
        return data;
    
      }catch(error){
              console.log(error.message);
      }
    }