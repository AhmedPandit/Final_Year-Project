export default (products=[],action)=>{

     switch(action.type){
        case 'FETCH_ALL':
            return action.payload;
        case 'CREATE':
            return [...products,action.payload];
        case 'UPDATE':
                return [...products,action.payload];
        

        case 'DELETE':
                return [...products,action.payload];
        default:
            return products;
     }

}