import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import api from "../../HTTPHandler/axiosConfig";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import { loginUserReset } from "../../HTTPHandler/api";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   borderRadius: 12,
//   // border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
//   hover: {
//     boxShadow: "15px 15px 30px #ccc",
//   },
// };

export default function BasicModal() {
  const { register, handleSubmit } = useForm();
  const [open, setOpen] = React.useState(true);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //! my datas
  const onSubmit = (data) => {
    loginUserReset(data)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log("Error logging in:", error);
      });
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>this is main page</Button> */}
      {/*  onClose={handleClose} */}
      <Modal open={open}>
        <Box marginTop={20}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              display={"flex"}
              height={350}
              flexDirection={"column"}
              maxWidth={400}
              justifyContent={"center"}
              alignItems={"center"}
              margin={"auto"}
              padding={5}
              borderRadius={9}
              bgcolor={"#bebebe"}
            >
              <Typography
                variant="h4"
                padding={3}
                textAlign={"center"}
                fontWeight={700}
              >
                Reset Password
              </Typography>
              <TextField
                type="password"
                variant="outlined"
                label="Password"
                name="Password"
                {...register}
                sx={{ width: "300px", marginBottom: "10px" }}
              />
              <TextField
                type="password"
                variant="outlined"
                label="Confirm Password"
                name="Password"
                {...register}
                sx={{ width: "300px", marginBottom: "10px" }}
              />

              <Button
                sx={{ marginTop: 3, borderRadius: 5 }}
                size="large"
                variant="contained"
                color="success"
                type="submit"
                onClick={handleClose}
              >
                Reset
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
