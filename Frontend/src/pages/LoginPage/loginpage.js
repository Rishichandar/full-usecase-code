
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../HTTPHandler/api";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios for making HTTP requests
import "./login.css";
import { Divider, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Loginpage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      console.log(response);
      if (response.Status === "Success") {
        toast.success("Get ready");
        await sendAuditInfo(data); // Send audit information after successful login
        navigate("/main");
      } else {
        toast.error(response.ErrMessage);
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  const sendAuditInfo = async (data) => {
    try {
      const response = await axios.post("http://localhost:4023/user/audit", {
        User_id: data.Email, // Assuming Email is the user ID
        Activity_type: "login", // Ensure this matches the valid types in the backend
        App_data: "login", // You can specify additional data here if needed
        Comments: "User logged in", // You can provide additional comments here
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error sending audit information:", error);
      // Handle error gracefully
      toast.error("Error sending audit information");
    }
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="main">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display={"flex"}
            height={400}
            flexDirection={"column"}
            maxWidth={450}
            justifyContent={"center"}
            alignItems={"center"}
            margin={"auto"}
            padding={5}
            bgcolor={"#eaf6f6"}
            borderRadius={9}
            sx={{
              boxShadow: "0px 0px 10px #aaa",
              ":hover": {
                boxShadow: "8px 8px 20px #27ABCC",
              },
            }}
          >
            <Typography variant="h3" padding={3} textAlign={"center"}>
              Login
            </Typography>
            <TextField
              type="email"
              variant="outlined"
              label="Email"
              name="Email"
              {...register("Email", { required: "Email id is required" })}
              sx={{ width: "300px", mb: 1 }}
              error={Boolean(errors.Email)}
              helperText={errors.Email && errors.Email.message}
            />

            <TextField
              type={showPassword ? "text" : "password"}
              marginTop={8}
              variant="outlined"
              label="Password"
              name="Password"
              {...register("Password", { required: "password is required" })}
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
              sx={{ width: "300px", height: "100px" }}
              error={Boolean(errors.Password)}
              helperText={errors.Password && errors.Password.message}
            />
            <Button
              sx={{ marginTop: 3, borderRadius: 5 }}
              size="large"
              variant="contained"
              color="success"
              type="submit"
            >
              Login
            </Button>
            <Divider sx={{ width: "100%", mt: 2 }}>or</Divider>

            <Link to="/forgotpass">
              <Button marginTop={"10px"} sx={{ marginTop: 1, borderRadius: 3 }}>
                Forgot password
              </Button>
            </Link>
          </Box>
        </form>
      </div>
    </div>
  );
};
