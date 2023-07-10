import React,{ useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@material-ui/core/Typography';
import Chat from '../components/Chat/Chat';
import {useParams} from "react-router";




const ChatContainer=()=>{
    const [value,setValue]=useState(0);
    const {user}=useParams("");

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

    <Tabs style={{marginTop:"1%"}} value={value} onChange={handleChange} aria-label="disabled tabs example">
        <Tab style={{width:"7%"}}label="Warehouses" />
        <Tab style={{width:"5%",marginRight:"1%"}}label="Buyers" />
        <Tab style={{width:"5%"}}label="Admin" />

      </Tabs>

      <TabPanel value={value} index={0}>
        <Chat value={"Warehouses"}  user={user}  selected={value}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Chat value={"Buyers"}  user={user} selected={value}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <Chat value={"Admin"}  user={user}  selected={value}/>
      </TabPanel>

        </div>
    
    )
}

export default ChatContainer;