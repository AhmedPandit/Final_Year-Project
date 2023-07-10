import "./ShipOrder.css";
import React,{useEffect,useState} from 'react';
import {useParams} from "react-router";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {Navbar,Sidebar,Footer, Header} from "../../components";
import { useStateContext } from '../../context/ContextProvider';
import {getuser} from "../../actions/user"



const ShipOrder = () => { 
  const dispatch=useDispatch();

  const { id } = useParams("");


  // const history = useHistory();

  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [userphone, setUserPhone] = useState("");
  const [accounthealth, setAccountHealth] = useState("");
  const [userpic, setUserPic] = useState("");
  const [ordershipped,setOrderShipped]=useState(false);

  // console.log([inddata]);

  const getiddata = async () => {

    const tosend={
        data:id
    }
    const data=await dispatch(getuser(tosend));
    console.log('here')
    console.log(data);
    setUserName(data.name);
    setAccountHealth(data.accounthealth);
    setUserEmail(data.email);
    setUserPhone(data.phone);
    setUserPic(data.image)
    
    

  };

  useEffect(() => {
      setTimeout(getiddata, 1000)
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
                 
                  <div style={{marginLeft:'10px',marginTop:'20px'}}>
                    

<div className="upperdiv">

    <Header title="Order Details"/>


</div>

<div className="buttondiv">


    <button style={{marginLeft:"90%"}}  className="RefundOrderButton">
        Refund Order
    </button>

</div>

<div className="middlediv">
    <div className="OrderSummary">

        <p className="DivHeading"> Order Summary</p>

        <table>
            <td>
                <tr>
                    <p>Ship by : date</p>
                </tr>
                <tr>
                    <p>Deliver by : date</p>
                </tr>
                <tr>
                    <p>Purchase date : date</p>
                </tr>
              
            </td>
            <td>
                
                <tr>
                    <p> Sales Channel: Stock Logistics</p>
                </tr>
            </td>

        </table>

      
        

    </div>

    <div className="CustomerSummary">

            <p className="DivHeading"> Customer Details </p>

        <table>
            <td>
                <tr>
                    <p>Ship by : date</p>
                </tr>
                <tr>
                    <p>Deliver by : date</p>
                </tr>
                <tr>
                    <p>Purchase date : date</p>
                </tr>
              
            </td>
            <td className="BetweenColumns">
                <tr>
                    <p> Shipping Service: UPS</p>
                </tr>
                
                <tr>
                    <p> Sales Channel: Stock Logistics</p>
                </tr>
            </td>

        </table>

    </div>

</div>




<div className="OrderContents">
<p className="DivHeading"> Order Contents </p>

    <div className="HeaderTable">
        <p className="HeaderEntry">Image </p>
        <p className="HeaderEntry"> Product Name</p>
        <p className="HeaderEntry">More Information</p>
        <p className="HeaderEntry"> Quantity</p>
        <p className="HeaderEntry">Unit Price</p>
        <p className="HeaderEntry"> Proceeds</p>

    </div>

</div>

{ordershipped? ( <div className="middlediv">
                <div className="ShippedSummary">

                    <p className="DivHeading"> Shipped Summary</p>

                    <table id="ShippedTable">
                        <td>
                            <tr>
                                <p>Ship Date :</p>
                            </tr>
                        </td>
                        <td>
                            <tr>
                                <p>Carrier</p>
                            </tr>
                        </td>
                        <td>
                            <tr>
                                <p>Shipping Service</p>
                            </tr>
                        </td>
                        
                        <td>
                            
                            <tr>
                                <p> Tracking Id:</p>
                            </tr>
                        </td>

                    </table>

                
                    

                    </div>
                </div>):( 
                    <div>
                        <button style={{marginLeft:"86%",marginTop:'20px',backgroundColor:'darkgreen' ,color:'white'}}  className="RefundOrderButton">
                            Forward Order Details
                        </button>
                        </div>
                )}

           
                </div>
            
          </div>

          </div>
     

  </div>
)
}

export default ShipOrder