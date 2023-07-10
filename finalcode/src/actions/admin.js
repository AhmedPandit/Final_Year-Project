import * as api from "../api";
export const getadminuser=(values)=>async(dispatch)=>{
    try{
            
            const {data}=await api.getadminuser(values);

            const setdata=data;
            console.log(setdata);

            
            dispatch ({type:'ADMIN_SELLER',setdata});
            return data;

    }catch(error){
            console.log(error.message);
    }
}
export const getadminwarehouse=(values)=>async(dispatch)=>{
    try{
            
            const {data}=await api.getadminwarehouse(values);

            const setdata=data;
            console.log(setdata);

            
            dispatch ({type:'ADMIN_WAREHOUSE',setdata});
            return data;

    }catch(error){
            console.log(error.message);
    }
}

export const deactivateSeller=(values)=>async(dispatch)=>{
    try{

        const {data}=await api.deactivateSeller(values);
   
        return data;
    }catch(error){
        console.log(error.message);
}
}
export const reactivateSeller=(values)=>async(dispatch)=>{
    try{

        const {data}=await api.reactivateSeller(values);
        return data;

    }catch(error){
        console.log(error.message);
}
}


export const deactivateWarehouse=(values)=>async(dispatch)=>{
    try{

        const {data}=await api.deactivateWarehouse(values);
   
        return data;
    }catch(error){
        console.log(error.message);
}
}
export const reactivateWarehouse=(values)=>async(dispatch)=>{
    try{

        const {data}=await api.reactivateWarehouse(values);
        return data;

    }catch(error){
        console.log(error.message);
}
}


export const getdisputeswarehouse=()=>async(dispatch)=>{
    try{
            
            const {data}=await api.getdisputeswarehouseadmin();
  
            const setdata=data;
  
             console.log(setdata);
            dispatch ({type:'ADMIN_WAREHOUSE_DISPUTES',setdata});
            return data;
  
    }catch(error){
            console.log(error.message);
    }
  }

  export const getdisputesseller=()=>async(dispatch)=>{
    try{
            
            const {data}=await api.getdisputesselleradmin();
  
            const setdata=data;
  
             console.log(setdata);
            dispatch ({type:'ADMIN_SELLER_DISPUTES',setdata});
            return data;
  
    }catch(error){
            console.log(error.message);
    }
  }

  export const answerwarehousedispute=(values,id)=>async(dispatch)=>{
    try{

        console.log(values + "  "+ id)
            const answer=values.answer
            
            const {data}=await api.answerwarehousedispute({answer,id});
  
            const setdata=data;
  
             console.log(setdata);
            return data;
  
    }catch(error){
            console.log(error.message);
    }
  }

  export const answersellerdispute=(values,id)=>async(dispatch)=>{
    try{

        console.log(values + "  "+ id)
            const answer=values.answer
            
            const {data}=await api.answersellerdispute({answer,id});
  
            const setdata=data;
  
             console.log(setdata);
            return data;
  
    }catch(error){
            console.log(error.message);
    }
  }


  export const gettotal=()=>async(dispatch)=>{

    try{

        const {data}=await api.gettotal();

        const setdata=data.allorders;

        return data;
        
       


}
catch(error){
    console.log(error.message);
}
}

export const getbuyerqueries=()=>async(dispatch)=>{

    try{

        const {data}=await api.getbuyerqueries();

        console.log(data);
        const setdata=data.queriesofbuyers

        dispatch ({type:'BUYER_QUERIES',setdata});

     

        return data.queriesofbuyers;
        
       


}
catch(error){
    console.log(error.message);
}

}