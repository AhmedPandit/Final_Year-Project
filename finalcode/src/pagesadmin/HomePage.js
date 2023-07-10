import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar} from "../componentsadmin";
import { useStateContext } from '../context/ContextProvider';
import { Ecommerce } from './index';
import { getordersadmin } from '../actions/orders';
import {getproductsadmin} from "../actions/products";
import {gettotal} from "../actions/admin";


const HomePage = () => { 
  const dispatch=useDispatch();
  
  const authData = JSON.parse(localStorage.getItem('adminprofile'));

  

  const { id } = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [orders,setOrders]=useState([])
  const [products,setproducts]=useState([]);
  const [count,setCount]=useState({});

  // console.log([inddata]);

  const getiddata =async ()=> {

   

  const data2=await dispatch(getordersadmin());
  const data3=await dispatch(getproductsadmin());
  const data4=await dispatch(gettotal());

  console.log(data2);
  console.log(data3);
  console.log(data4);
  setOrders(data2.allorders);
  setproducts(data3.allproducts);
  setCount(data4.counts);
  
    
  };

  useEffect(() => {
      setTimeout(getiddata)
  }, [id]);


const {activeMenu}=useStateContext();
 return (
  <div>
          <div className='flex relative dark:bg-main-dark-bg'>
                 
              {activeMenu ? (
                  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                    <  Sidebar email={authData.email} />
                  </div>
              ):(<div className='w-0 dark:bg-secondary-dark-bg'>
                     <Sidebar/>
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={authData.name} email={authData.email} />
                  </div>
                 
            <Ecommerce  allorders= {orders.length} orders={orders} allproducts={products.length} products={products}
             totalsellers={count.sellers} totalwarehouses={count.warehouses} unansweredseller={count.unansweredseller} unansweredwarehouse={count.unansweredwarehouse} />

            
          </div>

          </div>
     

  </div>
)
}
export default HomePage