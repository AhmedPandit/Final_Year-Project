import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar} from "../components";
import { useStateContext } from '../context/ContextProvider';
import { Ecommerce } from './index';
import {getuser} from "../actions/user"
import { getorders } from '../actions/orders';

const HomePage = () => { 
  
 
  const dispatch=useDispatch();
    

  const { id } = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [totalorders,settotalorders]=useState(0);
  const [totalinventory,settotalinventory]=useState(0);
  const [warehouse,settotalwarehouses]=useState(0);
  const [pendingbalance,setPendingBalance]=useState(0);
  const [accounthealth,setaccounthealth]=useState(0);
  const [withdrawnbalance,setWithDrawnBalance]=useState(0);
  const [allorders,setAllOrders]=useState(0);
  const [orders,setOrders]=useState([])
 

  // console.log([inddata]);

  const getiddata = async () => {
  
    const tosend={
        data:id
    }
    const data=await dispatch(getuser(tosend));
    const data2=await dispatch(getorders(tosend));

    console.log(data2);
    setOrders(data2.allorders);
    const authdata = JSON.parse(localStorage.getItem('profile'));

    console.log(authdata);
    
    setUserName(authdata.name);
    setUserEmail(authdata.email);
    setUserPic(authdata.image)
    setPendingBalance(data.pendingbalance);
    setaccounthealth(data.accountstanding)
    setWithDrawnBalance(data.withdrawnbalance);
    
    console.log(data)
    let count=0;
    let all=0;
    for (let i=0;i<data2.allorders.length;i++){
   
      all++;

      if(data2.allorders[i].status==="pending"){
        console.log("here");
        count++
        console.log(totalorders);
        }
  }
  setAllOrders(all);
  console.log(allorders);
  settotalorders(count);

  count=0;
  for (let i=0;i<data.inventory.length;i++){
   

    if(data.inventory[i].status==="active"){
      console.log("here");
      count++
      
      }
}
settotalinventory(count)

count=0;
for (let i=0;i<data.warehouses.length;i++){
 

  if(data.warehouses[i].status==="active"){
    console.log("here");
    count++
    
    }
}
settotalwarehouses(count)

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
                    <  Sidebar email={useremail} />
                  </div>
              ):(<div className='w-0 dark:bg-secondary-dark-bg'>
                     <Sidebar/>
                  </div>
              )}
              <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu? 'md:ml-72' :'flex-2'}`}>
                  <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                      <Navbar username={username} email={useremail} selectedfile={userpic}/>
                  </div>
                 
            <Ecommerce pendingorders={totalorders} balance={pendingbalance} accounthealth={accounthealth} 
            earnings={withdrawnbalance} activewarehouses={warehouse} activeinventory={totalinventory} allorders={allorders} orders={orders}/>

            
          </div>

          </div>
     

  </div>
)
}
export default HomePage