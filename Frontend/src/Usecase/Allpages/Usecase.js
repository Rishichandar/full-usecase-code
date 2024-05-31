import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import {
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Button,
  Stack,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/plugin/advancedFormat";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";

const ITEM_HEIGHT = 35;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const names = [
  "Rishi",
  "Thirumavalavan",
  "Jana",
  "Nandhini",
  "Manoj",
  "Somusundaram",
  "nagarajan",
  "abdullah",
  "Easuraja",
  "Neha",
  "Vinotha",
  "Rokith",
  "Sowmya",
  "Sandhiya",
  "Shanmugamoorthy",
  "Karthickraja",
  "Jayapriya",
  "Gokul",
  "Elakkiya",
  "Udhaya",
  "Akash",
  "Thirumalaivasan",
  "Jagadeesan",
  "Jerusha",
  "Madhi",
  "S.Karthick",
  "Rahul",
  "Nivetha",
  "sabari",
  "Dhandapani",
  "Theo",
  "Lokesh",
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function Usecase() {
  const [status, setStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();
  const title = location.state?.title;
  const email = location.state?.email;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    summary: "",
    team: "",
    status: "",
    enddate: "",
    reporterid: email,
    attachment: "",
    description: "",
    title: title,
  });

  const handleChangeDate = (date) => {
    setSelectedDate(date);
    setFormData((prevState) => ({
      ...prevState,
      enddate: date ? date.toISOString() : "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStatus(value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value);
    handleChange2({ target: { name: "team", value } });
  };

  const handleChange2 = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    // Validate form data
    if (!formData.summary || !formData.team || !formData.status) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      await axios.post("http://localhost:4023/usecase", formData);
      toast.success("Usecase added");

      setFormData({
        summary: "",
        team: [],
        status: "",
        enddate: "",
        reporterid: email,
        attachment: "",
        description: "",
        title: title,
      });
      setTimeout(() => {
        navigate("/usecaseReadEdit", { state: { title } });
      }, 2000);
    } catch (error) {
      console.error("Error adding use case:", error);
      toast.error("Error adding usecase");
    }
  };

  const back = () => {
    navigate("/user");
  };

  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    const typeTitle = async () => {
      for (let i = 0; i < title.length; i++) {
        setTypedTitle((prevTitle) => prevTitle + title[i]);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    };

    typeTitle();

    return () => setTypedTitle("");
  }, [title]);

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button id="back-btn4" variant="outlined" onClick={back}>
          Back
        </Button>
      </Stack>
      <div id="contain1">
        <span id="title1">{typedTitle}</span>
      </div>
      <form id="usecase-Form">
        <tr>
          <TextField
            id="filled-basic"
            label="Summary"
            variant="filled"
            style={{ width: "300px" }}
            InputLabelProps={{
              style: {
                fontSize: "13px",
                fontFamily:
                  "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
              },
            }}
            onChange={handleChange2}
            name="summary"
            value={formData.summary}
          />
        </tr>
        <br></br>
        <tr>
          <tr>
            <TextField
              id="outlined-basic"
              label="Reporter ID"
              variant="outlined"
              name="reporterid"
              value={formData.reporterid}
              sx={{
                m: 1,
                width: 300,
                position: "relative",
                bottom: 9,
                right: 8,
              }}
              InputLabelProps={{
                style: {
                  fontSize: "13px",
                  fontFamily:
                    "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
                },
              }}
              readOnly
            />
          </tr>
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={2}
            InputLabelProps={{
              style: {
                fontSize: "13px",
                fontFamily:
                  "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
              },
            }}
            onChange={handleChange2}
            name="description"
            style={{ width: "300px" }}
            value={formData.description}
          />
        </tr>
        <br></br>
        <tr>
          <FormControl
            sx={{
              m: 1,
              width: 300,
              position: "relative",
              bottom: 10,
              right: 8,
            }}
          >
            <InputLabel
              id="demo-single-name-label"
              style={{ fontSize: "14px" }}
            >
              Assignee{isFocused && "*"}
            </InputLabel>
            <Select
              name="team"
              id="sel"
              labelId="demo-single-name-label"
              style={{ height: "53px" }}
              value={personName}
              onChange={handleChange1}
              input={
                <OutlinedInput
                  label="Assignee"
                  style={{
                    fontSize: "10px",
                    fontFamily:
                      "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
                  }}
                />
              }
              MenuProps={MenuProps}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </tr>
        <tr>
          <FormControl
            sx={{ m: 1, width: 300, position: "relative", bottom: 7, right: 8 }}
          >
            <InputLabel
              id="demo-simple-select-label"
              style={{ fontSize: "14px" }}
            >
              Status{isFocused && "*"}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={handleChange}
              name="status"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"todo"}>Todo</MenuItem>
              <MenuItem value={"In progress"}>In progress</MenuItem>
              <MenuItem value={"Testing"}>Testing</MenuItem>
              <MenuItem value={"Done"}>Done</MenuItem>
            </Select>
          </FormControl>
        </tr>
        <tr>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="End date"
                sx={{ width: "300px" }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                value={selectedDate}
                onChange={handleChangeDate}
                name="enddate"
              />
            </DemoContainer>
          </LocalizationProvider>
        </tr>
        <tr>
          <Button
            id="attach-file"
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            style={{ fontSize: "11px" }}
          >
            Attach file
            <input
              type="file"
              onChange={handleChange2}
              name="attachment"
              style={{ display: "none" }}
            />
            <VisuallyHiddenInput type="file" />
          </Button>
          <Button
            onClick={handleAdd}
            id="add-btn"
            variant="contained"
            endIcon={<SendIcon style={{ height: "15px", fontSize: "11px" }} />}
            style={{ fontSize: "11px" }}
          >
            Add
          </Button>
        </tr>
      </form>
    </>
  );
}

export default Usecase;
