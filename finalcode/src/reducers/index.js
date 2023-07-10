import { combineReducers } from "redux";
import products from "./products";
import authReducer from "./auth";
import user from './user';
import warehouse from './warehouse'
export default combineReducers ({
    products,
    authReducer,
    user,
    warehouse
    

})