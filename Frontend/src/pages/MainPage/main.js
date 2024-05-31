import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Resetpage from "../ResetPasspage/resetpage";
import { useSelector } from "react-redux";
import Layout from "../../Component/layout";

function Main() {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  console.log(auth);
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  // ? for auth the user

  // ? for error message
  const [open, setOpen] = React.useState(true);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ? for getting the name

  return auth ? (
    <Box sx={{ margin: 0, padding: 0, boxSizing: "border-box" }}>
      <Box sx={{ width: "100vw", height: "100vh" }}>
        <Layout />
      </Box>
      {user.IsFirstLogin === 1 ? (
        <Modal open={open}>
          <Resetpage closeFn={handleClose} email={user.Email} />
        </Modal>
      ) : (
        <div></div>
      )}
    </Box>
  ) : (
    <Box></Box>
  );
}

export default Main;
