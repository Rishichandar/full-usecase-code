import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';
import { logout } from '../../Redux/authSlice/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { Settings, ExitToApp, Person } from "@mui/icons-material";

import {
   Avatar,
   Modal,
   Box,
   Typography,
   List,
   ListItem,
   ListItemText,
   Divider,
   Button,
 } from "@mui/material";

function Navbar(){
   const navigate = useNavigate();
  //  const roleid=useSelector((state)=>state.auth.user.RoleId)
  //  console.log("roleid :",roleid);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);
   const [open, setOpen] = useState(false);
   const data = useSelector((state) => state.auth.user);
   console.log("role",data.RoleId)
   const dispatch = useDispatch();
//for logout
   const handleLogout = () => {
      dispatch(logout());
     
      navigate("/");
    };
  //for register
    const register = () => {
      handleClose();
      navigate("/register");
    };
    return <>
     <nav className="navbar">
        {/* <h4 className='logo'>Project management</h4> */}
        <ul className='nav-links'>
           
            
             
        </ul>
        <Box mr={3}>
            <Avatar onClick={handleOpen} style={{ cursor: "pointer",marginRight:"20px" }}></Avatar>
          </Box>
        
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              width: 300,
              height: "100%",
              bgcolor: "background.paper",
              p: 2,
              boxShadow: 24,
              mt: 8,
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
              mb={5}
            >
              <Avatar
                onClick={handleOpen}
                style={{ cursor: "pointer", width: "100px", height: "100px" }}
              ></Avatar>

              <Typography variant="h6" component="h2" paddingTop={2}>
                {/* {data.RoleId}- */}
                {data.Email}
              </Typography>
              <Box
                width={"100%"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                <Typography color={data.RoleId === 2 ? "green" : "red"}>
                  {data.RoleId === 2 ? "User" : "Admin"}
                </Typography>
                <Button onClick={handleLogout}>
                  <ExitToApp />
                  Sign Out
                </Button>
              </Box>
            </Box>

            <Divider />
            <List>
              {data.RoleId === 2 ? (
                <Box>
                  <p style={{ color: "red"}}>Under Development process..</p>
                </Box>
              ) : (
                <ListItem button onClick={register}>
                  <Person sx={{ mr: 2 }} />
                  <ListItemText primary="Register" />
                </ListItem>
              )}

              <ListItem button>
                <Settings sx={{ mr: 2 }} />
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Box>
        </Modal>

        

     </nav>
     
 
 
     </>
 
 }
 export default Navbar;
