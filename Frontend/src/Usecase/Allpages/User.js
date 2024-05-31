import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiTask } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { IoMdPersonAdd } from "react-icons/io";
import { FcViewDetails } from "react-icons/fc";

function User() {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const Email = useSelector((state) => state.auth.user.Email);
  const [yourData, setYourData] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [email, setEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [success, setSuccess] = useState(false);
  const [toggleBarOpen, setToggleBarOpen] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [error, setError] = useState(null);
  const [showTab1, setShowTab1] = useState(true);
  const [showYourInfo, setShowYourInfo] = useState(true);
  const [isBlurAnimating, setIsBlurAnimating] = useState(false);

  useEffect(() => {
    fetchData1();
    // Trigger the blur animation on component mount
    setIsBlurAnimating(true);
  }, []);

  const fetchData1 = async () => {
    try {
      const response = await fetch(
        `http://localhost:4023/project_infouser?email=${Email}`
      );
      const jsonData = await response.json();
      setYourData(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const searchId = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:4023/project_info/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId !== "") searchId();
  }, [userId, searchId]);

  const handleChange = (event) => {
    setUserId(event.target.value);
  };

  const searchProject = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:4023/project_info1/${projectTitle}`
      );
      if (!response.ok) throw new Error("failed  to fetch");
      const ans = await response.json();
      setProjectData(ans);
      setEmail(ans.Email);
    } catch (error) {
      console.log(error);
    }
  }, [projectTitle]);

  useEffect(() => {
    if (projectTitle !== "") searchProject();
  }, [projectTitle, searchProject]);

  const handleChange1 = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleEdit = (yourData) => {
    setEditedData(yourData);
    setEditMode(true);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setEditedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const { Projectid, ...dataToSend } = editedData;
      await axios.put(
        `http://localhost:4023/api/update/${dataToSend.Title}`,
        dataToSend
      );
      setEditMode(false);
      setSuccess(true);
      toast.success("Updated successfully");

      const updatedYourData = yourData.map((item) =>
        item.Projectid === editedData.Projectid ? editedData : item
      );
      setYourData(updatedYourData);
    } catch (error) {
      console.log("Error updating data:", error);
      console.log(editedData);
    }
  };

  const downloadCSV = (data) => {
    if (!Array.isArray(data)) {
      console.error("Data is not in the expected format.");
      return;
    }

    if (data.length === 0) {
      console.warn("No data available to download.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDataCSV = () => {
    if (userData) {
      downloadCSV(userData);
    } else {
      console.error("No data available to download.");
    }
  };

  const tousecase = (title, teamMember, email) => {
    navigate("/usecase", { state: { title, teamMember, email } });
  };

  const tousecaseReadEdit = (title, email) => {
    navigate("/usecaseReadEdit", { state: { title, email } });
  };

  const totask = (title) => {
    navigate("/task", { state: { email: Email, title: title } });
  };

  const closeToggleBar = () => {
    setToggleBarOpen(false);
    setShowTab1(true);
  };

  const handleTaskButtonClick = async (title) => {
    try {
      const response = await fetch(
        `http://localhost:4023/task_details/${title}`
      );
      if (!response.ok) throw new Error("Failed to fetch task data");
      const jsonData = await response.json();
      setTaskData(jsonData);
      setToggleBarOpen(true);
      setShowTab1(!showTab1);
      setShowYourInfo(false);
    } catch (error) {
      toast.error("didnt add any taskdetails");
    }
  };

  const addProject = () => {
    navigate("/projectdetails");
  };

  return (
    <>
      {!editMode && showYourInfo && (
        <span id="your-info">
          My Projects
          <IoMdArrowDropdown id="icon1" />
        </span>
      )}
      <div className={`cont ${editMode ? "blur-background" : ""}`}>
        <div></div>
        <br></br>
        <br></br>
      </div>

      <div id="tab-user">
        {editMode ? (
          <div id="box">
            <form id="f">
              <label id="titlee">Title</label>
              <input
                id="edit-title"
                type="text"
                name="Title"
                value={editedData.Title}
                onChange={handleChanges}
              />
              <br></br>
              <label id="des">Description</label>
              <input
                id="edit-des"
                type="text"
                name="Description"
                value={editedData.Description}
                onChange={handleChanges}
              />
              <br></br>
              <label id="team">Team</label>
              <input
                id="edit-team"
                type="text"
                name="Team"
                value={editedData.Team}
                onChange={handleChanges}
              />
              <br></br>
              <label id="tools">Tools</label>
              <input
                id="edit-tools"
                type="text"
                name="Tools"
                value={editedData.Tools}
                onChange={handleChanges}
              />
              <br></br>
              <button
                id="sub2"
                onClick={() => {
                  saveChanges();
                  setEditMode(false);
                }}
              >
                Save
              </button>
              <span id="back-button" onClick={() => setEditMode(false)}>
                <IoArrowBack size={20} style={{ color: " #4f4f52" }} />
              </span>
              <br></br>
            </form>
          </div>
        ) : (
          <table
            id="table"
            style={{ filter: showTab1 ? "blur(0px)" : "blur(20px)" }}
          >
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Description</th>
                <th>Team members</th>
                <th>Start Date</th>
                <th>Deadline</th>
                <th>Tools used</th>
                <th colSpan={4}>Activity</th>
              </tr>
            </thead>
            <tbody>
              {yourData.length === 0 ? (
                <tr>
                  <td colSpan="9">No projects added</td>
                </tr>
              ) : (
                yourData.map((obj) => (
                  <tr key={obj.Projectid}>
                    <td>{obj.Title}</td>
                    <td className="scrollable-cell2">{obj.Description}</td>
                    <td>{obj.Team}</td>
                    <td>{obj.Startdate.substring(0, 10)}</td>
                    <td>{obj.Deadline.substring(0, 10)}</td>
                    <td>{obj.Tools}</td>
                    <td className="edit" onClick={() => handleEdit(obj)}>
                      <MdEdit size={18} style={{ color: "rgb(97, 94, 94)" }} />
                    </td>
                    <td className="usecase" style={{ cursor: "pointer" }}>
                      <span
                        onClick={() =>
                          tousecase(obj.Title, obj.Team, obj.Email)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <IoMdPersonAdd size={17} />
                      </span>
                    </td>
                    <td className="viewusecase" style={{ cursor: "pointer" }}>
                      <span
                        onClick={() => tousecaseReadEdit(obj.Title, obj.Email)}
                      >
                        <FcViewDetails size={17} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className={`toggle-bar ${toggleBarOpen ? "open" : ""}`}>
        <div className="toggle-bar-content">
          <table id="mini1">
            <thead>
              <tr>
                <th>Usecase</th>
                <th>Date</th>
                <th>Time</th>
                <th>Daily Task</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(taskData) &&
                taskData.map((obj) => (
                  <tr key={obj.ID}>
                    <td>{obj.usecasetitle}</td>
                    <td>{obj.Date.substring(0, 10)}</td>
                    <td>{obj.Time}</td>
                    <td>{obj.Dailytask}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <span onClick={closeToggleBar}>
            <IoClose />
          </span>
        </div>
      </div>
      {!editMode && (
        <div>
          <div className="circle" id="add-button" onClick={addProject}>
            <GoPlus size={40} color="white" />
          </div>
        </div>
      )}
    </>
  );
}

export default User;
