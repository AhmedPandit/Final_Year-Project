import * as api from "../api";


export const getuser=(values)=>async(dispatch)=>{
    try{
            
            const {data}=await api.getuser(values);

            const setdata=data;

            
            dispatch ({type:'AUTH',setdata});
            return data;

    }catch(error){
            console.log(error.message);
    }
}

export const getdisputes=(values)=>async(dispatch)=>{
  try{
          
          const {data}=await api.getdisputes(values);

          const setdata=data;

           console.log(setdata);
          dispatch ({type:'SELLER_DISPUTES',setdata});
          return data;

  }catch(error){
          console.log(error.message);
  }
}

export const updateuser = (id, values) => async (dispatch) => {
        try {
         
          const { data } = await api.updateuser(id, values);

          const setdata=data.result;
          console.log(setdata);
          dispatch({ type: 'AUTH',setdata });
          return setdata;
        } catch (error) {
          console.log(error);
        }
      };

export const forgotpassword = (values) => async (dispatch) => {
        try {

         
          const { data } = await api.forgotpassword(values);
      
          return (data.status);

        } catch (error) {
          console.log(error);
        }
      };

export const resetpassword = (id,token) => async (dispatch) => {


        try {

                const { data } = await api.resetpassword(id,token);

                dispatch({ type: 'RESET_PASS', payload: data });

                return data;


         

        } catch (error) {
          console.log(error);
        }
      };


export const setresetpassword = (id,token,values) => async (dispatch) => {



        try {

                const { data } = await api.setresetpassword(id,token,values);

                dispatch({ type: 'SET_RESET_PASS', payload: data });

                return data;


         

        } catch (error) {
          console.log(error);
        }
      };
      
  export const setwarehousetoview=(values)=>async(dispatch)=>{
        try{
                
             console.log(values);
             const setdata=values;
             dispatch ({type:'SET_WAREHOUSE',setdata});
    
        }catch(error){
                console.log(error.message);
        }
    }


    export const filedisputeseller=(values)=>async(dispatch)=>{
      try{
              
    
        const {data}=await api.filedisputeseller({values})
        console.log(data);
        return data;
  
      }catch(error){
              console.log(error.message);
      }
  }

  export const requestpaymentseller=(values)=>async(dispatch)=>{
    try{
            
      

      console.log(values);
      const {data}=await api.requestpaymentseller({values})
      console.log(data);
      return data;

    }catch(error){
            console.log(error.message);
    }
}
export const getuserpayments=(values)=>async(dispatch)=>{
  try{
          
    console.log(values);
    const {data}=await api.getuserpayments({values})
    console.log(data);
    return data;

  }catch(error){
          console.log(error.message);
  }
}