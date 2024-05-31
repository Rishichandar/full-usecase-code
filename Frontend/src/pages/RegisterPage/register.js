

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { IconButton, MenuItem, Select, InputAdornment } from "@mui/material";
import api from "../../HTTPHandler/axiosConfig";
import { toast } from "react-toastify";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { regEmailSender } from "../../HTTPHandler/api";
import axios from "axios"; // Import axios for making HTTP requests

export default function Register() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    try {
      const response = await createUser(data);
      if (response.data.Status === "Success") {
        await sendAuditInfo(data); // Send audit information after successful registration
        toast.success("Successfully Registered!");
      } else {
        toast.error(response.data.ErrMessage);
      }
    } catch (error) {
      console.log("Error registering:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const createUser = async (data) => {
    try {
      const response = await api.post("/user/create", data); // data will be passed in the request body
      console.log(response);

      //! Send registration email
      try {
        await regEmailSender(data.Email, data.Password);
        toast.success("Registration email sent successfully!");
      } catch (emailError) {
        console.error("Error sending registration email:", emailError);
        toast.error("Failed to send registration email.");
      }

      reset();
      return response;
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 409) {
          toast.error("Email already exists. Please use a different email.");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized request. Check credentials.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("Network or server error.");
      }
      throw error;
    }
  };

  const sendAuditInfo = async (data) => {
    try {
      const response = await axios.post("http://localhost:4023/user/audit", {
        User_id: data.Email, // Assuming Email is the user ID
        Activity_type: "registered for this mail", // Ensure this matches the valid types in the backend
        App_data: "registration", // You can specify additional data here if needed
        Comments: "User registered", // You can provide additional comments here
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error sending audit information:", error);
      // Handle error gracefully
      toast.error("Error sending audit information");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <NavLink
        to="/main"
        style={{
          textDecoration: "none",
          position: "absolute",
          top: "18%",
          left: "86%",
        }}
      >
        <Button variant="contained" href="#contained-buttons">
          Back
        </Button>
      </NavLink>
      <div style={{ width: "500px", height: "400px" }}>
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
            sx={{
              boxShadow: "0px 0px 10px #aaa",
              "&:hover": {
                boxShadow: "8px 8px 20px #27ABCC",
              },
            }}
          >
            <Typography variant="h3" padding={3} textAlign={"center"}>
              Register
            </Typography>

            <TextField
              type="email"
              variant="outlined"
              label="Email"
              name="Email"
              fullWidth
              error={!!errors.Email}
              helperText={errors.Email?.message}
              {...register("Email", { required: "Email id is required" })}
              sx={{ width: "300px", height: "100px", marginBottom: "10px" }}
            />

            <TextField
              type={showPassword ? "text" : "password"}
              variant="outlined"
              label="Password"
              name="Password"
              error={!!errors.Password}
              helperText={errors.Password?.message}
              {...register("Password", { required: "Password is required" })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: "300px", height: "100px", marginBottom: "10px" }}
            />

            <Select
              variant="standard"
              defaultValue="-1"
              {...register("RoleId", { required: true })}
              sx={{ width: "300px", height: "100px", marginBottom: "10px" }}
            >
              <MenuItem value="-1" disabled>
                Select
              </MenuItem>
              <MenuItem value="1">Admin</MenuItem>
              <MenuItem value="2">Employee</MenuItem>
            </Select>
            
            <Button
              sx={{ marginTop: 3, borderRadius: 2 }}
              size="large"
              variant="contained"
              color="success"
              type="submit"
            >
              Register
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
}
