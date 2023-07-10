import React,{ useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@material-ui/core/Typography';
import Login from '../components/SignIn/Signin';
import Signup from '../components/SignUp/Signup';



const SignInoutContainer=()=>{
    const [value,setValue]=useState(0);

    const handleChange=(event,newValue)=>{
            setValue(newValue)
    }
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }

    return(
        <div>

    <Tabs style={{marginLeft:"35%",marginTop:"5%"}} value={value} onChange={handleChange} aria-label="disabled tabs example">
        <Tab style={{width:"20%",marginRight:"10%"}}label="Log In" />
        <Tab style={{width:"20%"}}label="Sign Up" />

      </Tabs>

      <TabPanel value={value} index={0}>
        <Login handleChange={handleChange}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Signup/>
      </TabPanel>

        </div>
    
    )
}

export default SignInoutContainer;