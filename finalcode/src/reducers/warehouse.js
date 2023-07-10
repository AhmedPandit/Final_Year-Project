const warehouse= (state={warehousedata:null},action)=>{

    switch(action.type){
       case 'FETCH_DATA':
           return action.payload;
       case 'GET_SELLER':
            return action.payload;
       case 'FETCH_WARE_Data':
            return action.payload;
        case 'FETCH_WARE_SELLER_Data':
            return action.payload;

         case 'REMOVE_SELLER':
                return action.payload;
        case 'ADD_WARE_Data':
                return action.payload;

           default:
            return state;
     }
 
 }
 export default warehouse