import * as api from "../api";

export const getchatuser=(value)=>async(dispatch)=>{

    try {
        console.log(value);
        const data= await api.getsellerchat(value);
        console.log(data.data);
        return data.data;
        
    } catch (error) {
        
    }

}