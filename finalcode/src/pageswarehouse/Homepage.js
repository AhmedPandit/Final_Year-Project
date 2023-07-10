import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar} from "../componentswarehouse";
import { useStateContext } from '../context/ContextProvider';
import { Ecommerce } from './index';
import { getwarehouseuser } from '../actions/warehouse';


const HomePage = () => { 
  
  const authData = JSON.parse(localStorage.getItem('wareprofile'));
  const dispatch=useDispatch();
  

  const { id } = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userpic, setUserPic] = useState("");
  const [totalorders,settotalorders]=useState(0);
  const [latestorders,setlatestorders]=useState([]);
  const [status,setStatus]=useState("")
 

  // console.log([inddata]);

  const getiddata =async ()=> {

    const tosend={
      data:id
  }
     const data=await dispatch(getwarehouseuser(tosend));

    setUserName(authData.name);
    setUserEmail(authData.email);
    setUserPic(authData.image)
    setStatus(authData.accountstanding);
    console.log(status)
    
    let total=0
    for (let i=0;i<data.orders.length;i++){

      if(data.orders[i].status==="pending"){
        total++
        }

      if(i>=data.orders.length-5){
      
  
        setlatestorders(latestorders=>[...latestorders,data.orders[i]])

        

      }
    
      
  }
  settotalorders(total);
    
    

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
                 
            <Ecommerce pendingorders={totalorders} balance={authData.pendingbalance} accounthealth={authData.accountstanding} 
            earnings={authData.withdrawnbalance} latestorders={latestorders} status={status} warehousearea={authData.warehousearea}/>

            
          </div>

          </div>
     

  </div>
)
}
export default HomePage