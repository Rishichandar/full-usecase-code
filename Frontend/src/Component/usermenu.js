
//this is new code and add the audit log.
import React, { useState } from "react";
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
import { Settings, ExitToApp, Person } from "@mui/icons-material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./usermenu.css";
import pozentLogo from "./pozent_corporation_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice/AuthSlice";
import { resetTimer } from "../Redux/timerSlice/TimerSlice";
import { toast } from "react-toastify";
import axios from "axios";
import Footer from "./footer/footer";

const UserMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const data = useSelector((state) => state.auth.user);

  const sendAuditInfo = async (data) => {
    try {
      const response = await axios.post("http://localhost:4023/user/audit", {
        User_id: data.Email, // Assuming Email is the user ID
        Activity_type: "Signout", // Ensure this matches the valid types in the backend
        App_data: "signout in attendance", // You can specify additional data here if needed
        Comments: "signout", // You can provide additional comments here
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error sending audit information:", error);
      // Handle error gracefully
      toast.error("Error sending audit information");
    }
  };

  const handleLogout = async () => {
    try {
      await sendAuditInfo(data);
      dispatch(logout());
      dispatch(resetTimer());
      navigate("/");
      toast.success("Successfully signed out!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Sign out failed. Please try again.");
    }
  };

  const register = () => {
    handleClose();
    navigate("/register");
  };




  return auth ? (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#3c9ab0",
            width: "100%",
            height: "12%",
            position: "fixed",
            zIndex: 3,
          }}
        >
          <Box>
            <img width={170} height={70} src={pozentLogo} alt="Pozent" />
          </Box>
          <Typography color={"white"}>ATTENDANCE MANAGEMENT SYSTEM</Typography>

          <Link to={"/allData"} className="li">
            LOGS
          </Link>
          <Box mr={3}>
            <Avatar onClick={handleOpen} style={{ cursor: "pointer" }}></Avatar>
          </Box>
        </div>
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
                  <p style={{ color: "red" }}>Under Development Process!!</p>
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
        <div style={{ width: "100%", height: "100%" }}>
          <Outlet />
        </div>
        <Footer/>
        {/* <footer
          style={{
            width: "100%",
            height: "9%",
            color: "whitesmoke",
            backgroundColor: "#3c9ab0",
            position: "absolute",
            top: "91%",
            zIndex: 2,
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              position: "absolute",
              top: "30%",
            }}
          >
            ©2024 Pozent. All Rights Reserved.
          </p>
        </footer> */}
      </div>
    </>
  ) : (
    <Box></Box>
  );
};

export default UserMenu;


