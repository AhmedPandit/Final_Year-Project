const user=(state={authData:null},action)=>{

    switch(action.type){
       case 'FETCH_DATA':
           return action.payload;

       case 'UPDATE':

       console.log(action.setdata);
        
        localStorage.setItem('profile',JSON.stringify({...action?.setdata}));
        console.log(localStorage.getItem('profile'))
        return {...state,authData:action?.setdata};

        case 'SET_WAREHOUSE':
            console.log(action);
            localStorage.removeItem('setwarehouse');
            localStorage.setItem('setwarehouse',JSON.stringify({...action?.setdata}));
            return {...state,authData:action?.setdata};


       case 'FORGOT_PASS':
            return action.payload;
        case 'RESET_PASS':
            return action.payload;
        case 'SET_RESET_PASS':
            return action.payload;
       default:
           return state;
    }

}
export default user