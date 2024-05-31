import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function Signup() {
  const navigate = useNavigate();
  const Email = useSelector((state) => state.auth.user.Email);
  const location = useLocation();
  const { state } = location;
  const { title, summary } = state;

  const [taskDetails, setTaskDetails] = useState("");
  const [emailid, setEmail] = useState(Email);
  const [Title, settitle] = useState(title);

  const handleInputChange = (e) => {
    setTaskDetails(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskDetails.trim()) {
      toast.error("Didn't add task");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4023/taskdetails", {
        taskDetails,
        emailid,
        Title,
        summary,
      });
      console.log(response.data);
      toast.success("Task added successfully");
      setTaskDetails("");
      setTimeout(() => {
        navigate("/usecaseReadEdit", { state: { title } });
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const back = () => {
    navigate("/usecaseReadEdit", { state: { title } });
  };

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button id="back-btn2" variant="outlined" onClick={back}>
          Back
        </Button>
      </Stack>
      <div id="task-container">
        <div id="tot-form">
          <div id="quotes">
            <span id="h4">TASK DETAILS</span>
            <br />
            <span id="tag-line1">
              Every task detail is a step closer to project perfection.
            </span>
            <span id="tag-line2"> Let's craft a masterpiece together.</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div id="task-form">
              <div id="fields">
                <br />
                <br />
                <input
                  id="task-details"
                  className="field"
                  type="text"
                  placeholder="Enter task details"
                  value={taskDetails}
                  onChange={handleInputChange}
                  required
                />
                <br />
                <br />
                <input className="btn-sub" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
