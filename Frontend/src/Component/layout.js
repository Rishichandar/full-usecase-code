



import React, { useState } from "react";
import "./layout.css";
import img from "./Am.png";
import { Box, Button, keyframes } from "@mui/material";
import api from "../HTTPHandler/axiosConfig";
import Timer from "../CommonComponenets/TimerComponent/timer";
import { useDispatch, useSelector } from "react-redux";
import { manageTimer } from "../Redux/timerSlice/ManageTimer";
import { endTimer } from "../Redux/timerSlice/TimerSlice";
import breakImg from "./rbreak.jpg";
import lunch from "./rlunch.jpg";
import { toggleBreak, toggleLunch } from "../Redux/ctrlMngntSilce/breakManagementSlice";
import { toast } from "react-toastify";
import { Welcomemsg } from "./welcomemsg";
import axios from "axios";

const Layout = () => {
  // Define the animation
  const fadeIn = keyframes`
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  `;

  const [comment, setComment] = useState("");
  const userEmail = useSelector((state) => state.auth.user?.Email);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.timerState.timerActive);
  const isLunchIn = useSelector((state) => state.breakManagementSlice.isLunchIn);
  const isBreakIn = useSelector((state) => state.breakManagementSlice.isBreakIn);
  const interval = useSelector((state) => state.timerState.interval);
  const [imageType, setImageType] = useState("main");

  const handleStart = () => {
    dispatch(manageTimer());
  };

  const handleStop = () => {
    if (interval) {
      dispatch(endTimer());
    }
  };

  const handleLoginToggle = () => {
    const activityType = isLoggedIn ? "Time Out" : "Time In";
    isLoggedIn ? handleStop() : handleStart();
    const commentText = comment.trim();
    if (commentText !== "") {
      storeActivity("comment", commentText);
      setComment("");
    }
    storeActivity(activityType, commentText);
  };

  const handleActivityToggle = () => {
    dispatch(toggleBreak());
    setImageType(isBreakIn ? "main" : "break");
    const activityType = isBreakIn ? "breakout" : "breakin";
    const commentText = comment.trim();
    storeActivity(activityType, commentText);
    setComment("");
  };

  const handleLunchToggle = () => {
    dispatch(toggleLunch());
    setImageType(isLunchIn ? "main" : "lunch");
    const activityType = isLunchIn ? "lunchout" : "lunchin";
    const commentText = comment.trim();
    storeActivity(activityType, commentText);
    setComment("");
  };

  const storeActivity = async (activityType, commentText) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const currentdate = `${year}-${month}-${day}`;
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}:${seconds}`;

    const data = {
      Date: currentdate,
      Time: currentTime,
      Userid: userEmail,
      Activity_type: activityType,
      Comments: commentText,
    };

    try {
      const response = await api.post("/attendance_app", data);
      toast.success(`You have successfully ${activityType}`);
      await sendAuditInfo(data); // Send audit information after successful activity storage
    } catch (error) {
      console.error(`Error storing ${activityType} time:`, error);
    }
  };

  const sendAuditInfo = async (data) => {
    try {
      const response = await axios.post("http://localhost:4023/user/audit", {
        User_id: data.Userid,
        Activity_type: data.Activity_type,
        App_data: "attendance data logs",
        Comments: "time logs",
      });
      console.log("Audit info sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending audit information:", error);
      toast.error("Error sending audit information");
    }
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          top: "140px",
          width: "100%",
          height: "30px",
        }}
      >
     
        <div className="marquee">
          <marquee>
          Any violation will be treated as a security incident and referred to HR for appropriate diciplinary action
          </marquee>
        </div>
      </div>
      <div
        className="layout"
        style={{
          width: "100vw",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* left container */}
        <Box
          className="left-image"
          sx={{
            paddingTop: "90px",
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            className="inner-image"
            width={600}
            height={400}
            sx={{
              animation: `${fadeIn} 2s ease-out forwards`,
            }}
          >
            <Welcomemsg />
            {imageType === "main" && <img src={img} alt="" className="logo-wel" />}
            {imageType === "break" && <img src={breakImg} alt="" className="logo-wel" />}
            {imageType === "lunch" && <img src={lunch} alt="" className="logo-wel" />}
          </Box>
        </Box>
        {/* Right container */}
        <Box
          className="right-side-div"
          sx={{
            paddingTop: "25px",
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* split into two one is for logo image and another for timelogs */}
          <Box
            className="Food Logo-container"
            width={"100%"}
            height={"23%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              className="food logo"
              width={"100%"}
              height={"100%"}
            >
              {/* Logo */}
            </Box>
          </Box>
          {/* timings container */}
          <Box
            className="timing container"
            width={"100%"}
            height={"55%"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Box
              width={"400px"}
              height={"350px"}
              bgcolor={"#e1dede"}
              borderRadius={"10px"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
              sx={{
                boxShadow: "0px 0px 10px #aaa",
                "&:hover": {
                  boxShadow: "2px 2px 20px #27ABCC",
                },
              }}
            >
              <Box>
                <input
                  type="text"
                  value={comment}
                  onChange={handleInputChange}
                  placeholder="Enter your comment"
                  className="comment-input"
                />
              </Box>
              <Box>
                <Timer />
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
              >
                <Button
                  variant="contained"
                  color={isLoggedIn ? "primary" : "success"}
                  className="login-button"
                  onClick={handleLoginToggle}
                  disabled={isLunchIn || isBreakIn}
                >
                  {isLoggedIn ? "Time Out" : "Time In"}
                </Button>
                {isLoggedIn && (
                  <>
                    <Button
                      variant="contained"
                      color={!isBreakIn ? "success" : "error"}
                      className="break-button"
                      onClick={handleActivityToggle}
                      disabled={isLunchIn}
                    >
                      {!isBreakIn ? "Break In" : "Break Out"}
                    </Button>
                    <Button
                      variant="contained"
                      color={!isLunchIn ? "success" : "error"}
                      className="lunch-button"
                      onClick={handleLunchToggle}
                      disabled={isBreakIn}
                    >
                      {!isLunchIn ? "Lunch In" : "Lunch Out"}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Layout;
