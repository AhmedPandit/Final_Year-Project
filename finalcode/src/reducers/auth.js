const authReducer=(state={authData:null},action)=>{

    switch(action.type){
        case 'AUTH':
            console.log(action);
            localStorage.removeItem('profile');
            localStorage.setItem('profile',JSON.stringify({...action?.setdata}));
            return {...state,authData:action?.setdata};
        
   

        
        case 'WARE_AUTH':
            localStorage.removeItem('wareprofile');
            localStorage.setItem('wareprofile',JSON.stringify({...action?.setdata}));
            return {...state,authData:action?.setdata};

        case 'ADMIN_AUTH':
                localStorage.removeItem('adminprofile');
                localStorage.setItem('adminprofile',JSON.stringify({...action?.setdata}));
                return {...state,authData:action?.setdata};

         case 'ADMIN_SELLER':
                    localStorage.removeItem('adminseller');
                    localStorage.setItem('adminseller',JSON.stringify({...action?.setdata}));
                    return {...state,authData:action?.setdata};
                    

        case 'ADMIN_WAREHOUSE':
                        localStorage.removeItem('adminwarehouse');
                        localStorage.setItem('adminwarehouse',JSON.stringify({...action?.setdata}));
                        return {...state,authData:action?.setdata};

        case 'SET_INVEN':
                console.log(action);
                localStorage.removeItem('inventory');
                localStorage.setItem('inventory',JSON.stringify({...action?.setdata}));
                return {...state,authData:action?.setdata};

        case 'SELLER_DISPUTES':
                    console.log(action);
                    localStorage.removeItem('sellerdispute');
                    localStorage.setItem('sellerdispute',JSON.stringify({...action?.setdata}));
                    return {...state,authData:action?.setdata};

        case 'WAREHOUSE_DISPUTES':
                        console.log(action);
                        localStorage.removeItem('warehousedispute');
                        localStorage.setItem('warehousedispute',JSON.stringify({...action?.setdata}));
                        return {...state,authData:action?.setdata};
        case 'ADMIN_WAREHOUSE_DISPUTES':
                            console.log(action);
                            localStorage.removeItem('adminwarehousedispute');
                            localStorage.setItem('adminwarehousedispute',JSON.stringify({...action?.setdata}));
                            return {...state,authData:action?.setdata};
        case 'ADMIN_SELLER_DISPUTES':
                                console.log(action);
                                localStorage.removeItem('adminwsellerdispute');
                                localStorage.setItem('adminsellerdispute',JSON.stringify({...action?.setdata}));
                                return {...state,authData:action?.setdata};
        case 'BUYER_QUERIES':
                                    console.log(action);
                                    localStorage.removeItem('buyerqueries');
                                    localStorage.setItem('buyerqueries',JSON.stringify({...action?.setdata}));
                                    return {...state,authData:action?.setdata};

        case 'ORDER':
            localStorage.removeItem('orderprofile');
            localStorage.setItem('orderprofile',JSON.stringify({...action?.setdata}));
            return {...state,authData:action?.setdata};
        case 'LOGOUTADMIN':
            localStorage.removeItem('adminprofile');
            return {...state,authData:null};
        case 'LOGOUTSELLER':
                localStorage.removeItem('profile');
                return {...state,authData:null};

        case 'LOGOUTWAREHOUSE':
                    localStorage.removeItem('wareprofile');
                    return {...state,authData:null};

        default:
            return state

    };
      


}

export default authReducer