import * as api from "../api";



export const deliverorder=(values)=>async(dispatch)=>{
    try{

            const {data}=await api.deliverorder(values);
            
            dispatch ({type:'UPDATE',payload:data});


    }
    catch(error){
        console.log(error.message);
    }
}


export const cancelorder=(values)=>async(dispatch)=>{
    try{

            const {data}=await api.cancelorder(values);
            
            dispatch ({type:'UPDATE',payload:data});


    }
    catch(error){
        console.log(error.message);
    }
}

export const shiporder=(values)=>async(dispatch)=>{
    try{

            const {data}=await api.shiporder(values);
            
            dispatch ({type:'UPDATE',payload:data});

            return data;


    }
    catch(error){
        console.log(error.message);
    }
}

export const getorders=(values)=>async(dispatch)=>{

    try{

        const {data}=await api.getorders(values);

        const setdata=data.allorders;

        console.log(setdata);
        

            
        dispatch ({type:'ORDER',setdata});
        return data;
        
       


}
catch(error){
    console.log(error.message);
}
}

export const getordersadmin=()=>async(dispatch)=>{

    try{

        const {data}=await api.getordersadmin();

        const setdata=data.allorders;

        console.log(setdata);
        

            
        dispatch ({type:'ORDER',setdata});
        return data;
        
       


}
catch(error){
    console.log(error.message);
}
}


export const getorder=(values)=>async(dispatch)=>{

    try{

        console.log(values)

        const {data}=await api.getorder(values);
        
        return data


}

catch(error){
    console.log(error.message);
}
}



export const shiporderfromseller=(values)=>async(dispatch)=>{

    try{

        console.log(values)

        const {data}=await api.shiporderfromseller(values);
        
        return data


}
catch(error){
    console.log(error.message);
}
}


export const cancelorderseller=(values)=>async(dispatch)=>{
    try{

            console.log(values);

            const {data}=await api.cancelorderseller(values);

            
             return data;


    }
    catch(error){
        console.log(error.message);
    }
}

export const refundorderseller=(values)=>async(dispatch)=>{
    try{

            const {data}=await api.refundorderseller(values);
            
            return data


    }
    catch(error){
        console.log(error.message);
    }
}


