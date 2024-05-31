import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Zoom } from "react-toastify";
import TextField from "@mui/material/TextField";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FcViewDetails } from "react-icons/fc";

const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [activationStates, setActivationStates] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showTab1, setShowTab1] = useState(true);
  useEffect(() => {
    fetchData1();
    fetchData2();
  }, []);

  const fetchData1 = async () => {
    try {
      const response = await fetch("http://localhost:4023/project_info");
      const jsonData = await response.json();
      setData(jsonData);
      setActivationStates(Array(jsonData.length).fill(true));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await fetch("http://localhost:4023/project_info1");
      const jsonData = await response.json();
      setTaskData(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSoftDelete = async (Projectid, index) => {
    try {
      await axios.put(
        `http://localhost:4023/api/project_info/delete/${Projectid}`
      );
      const newActivationStates = [...activationStates];
      newActivationStates[index] = false;
      setActivationStates(newActivationStates);
    } catch (error) {
      console.error("Error soft deleting project:", error);
    }
  };

  const cancelSoftDelete = async (Projectid, index) => {
    try {
      await axios.put(
        `http://localhost:4023/api/project_info/canceldelete/${Projectid}`
      );
      const newActivationStates = [...activationStates];
      newActivationStates[index] = true;
      setActivationStates(newActivationStates);
    } catch (error) {
      console.error("Error soft deleting project:", error);
    }
  };

  const downloadCSV = (data) => {
    const headers = [
      "Project-ID",
      "Title",
      "Email",
      "Description",
      "Team members",
      "Start Date",
      "Deadline",
      "Tech Stack",
    ];
    const csvRows = [
      headers.join(","), // Join headers with commas
      ...data.map((row) => Object.values(row).join(",")), // Map data rows to CSV format
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const downloadAllCSV1 = () => {
    downloadCSV(data);
  };

  const downloadAllCSV2 = () => {
    downloadCSV(taskData);
  };

  const notify1 = () =>
    toast.error("Deactivated successfully", { transition: Zoom });
  const notify2 = () => toast.success("Activated successfully");

  const handleTaskButtonClick = (title, email) => {
    navigate("/usecaseReadEdit", { state: { title, email } });
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const clearSearch = () => {
    setProjectData(null);
    setProjectTitle("");
  };

  const handleChange1 = (event) => {
    setProjectTitle(event.target.value);
  };

  const searchProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:4023/project_info1/${projectTitle}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const ans = await response.json();
      setProjectData(ans);
    } catch (error) {
      console.log(error);
    }
  };
  const [toggleBarOpen, setToggleBarOpen] = useState(false);
  const closeToggleBar = () => {
    // Close the toggle bar
    setToggleBarOpen(false);
    setShowTab1(true);
  };

  return (
    <>
      <span id="all" style={{ filter: showTab1 ? "blur(0px)" : "blur(20px)" }}>
        All Projects
        <IoMdArrowDropdown size={15} id="all-icon" />
      </span>
      <button
        onClick={downloadAllCSV1}
        id="down-al"
        style={{ filter: showTab1 ? "blur(0px)" : "blur(20px)" }}
      >
        Download
      </button>
      {/* Existing UI code */}
      <span id="search1" className="viewsearch" onClick={toggleSearchBar}>
        <FiSearch size={23} />
      </span>
      {showSearchBar && (
        <>
          <TextField
            id="search-bar"
            name="ID"
            value={projectTitle}
            onChange={handleChange1}
            label="Search"
            variant="standard"
            style={{ marginLeft: "350px", width: "300px" }}
          />

          <span
            onClick={clearSearch}
            id="search-close"
            style={{ color: "grey" }}
          >
            <IoClose size={20} />
          </span>
          <span id="search-icon" onClick={searchProject}>
            <IoSearchOutline size={17} />
          </span>
        </>
      )}

      {projectData === null ? (
        <div
          id="tab2"
          style={{ filter: showTab1 ? "blur(0px)" : "blur(20px)" }}
        >
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Email</th>
                <th>Description</th>
                <th>Team members</th>
                <th>Start Date</th>
                <th>Deadline</th>
                <th>Tech Stack</th>
                <th>Deactivate/Activate</th>
                <th>Usecase</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {data.map((obj, Index) => (
                <tr key={obj.Projectid}>
                  <td>{obj.Title}</td>
                  <td>{obj.Email}</td>
                  <td className="scrollable-cell1">{obj.Description}</td>
                  <td>{obj.Team}</td>
                  <td>{obj.Startdate.substring(0, 10)}</td>
                  <td>{obj.Deadline.substring(0, 10)}</td>
                  <td>{obj.Tools}</td>
                  {activationStates[Index] ? (
                    <td>
                      <button
                        id="deac-btn1"
                        onClick={() => {
                          handleSoftDelete(obj.Projectid, Index);
                          notify1();
                        }}
                      >
                        Deactivate
                      </button>
                    </td>
                  ) : (
                    <td>
                      <button
                        id="deac-btn2"
                        onClick={() => {
                          cancelSoftDelete(obj.Projectid, Index);
                          notify2();
                        }}
                      >
                        Activate
                      </button>
                    </td>
                  )}
                  {/* <BiTask size={20} style={{ marginLeft: "8px", color: "#47d86b" }} /> */}
                  <td>
                    <span
                      className="viewusecase1"
                      onClick={() => {
                        handleTaskButtonClick(obj.Title, obj.Email);
                      }}
                      id="usecase-nav"
                    >
                      <FcViewDetails size={20} />
                    </span>
                  </td>
                  <td>
                    <button id="down-btn1" onClick={() => downloadCSV([obj])}>
                      <IoCloudDownloadOutline
                        size={25}
                        style={{ color: "grey" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          id="tab1"
          style={{ filter: showTab1 ? "blur(0px)" : "blur(20px)" }}
        >
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Email</th>
                <th>Description</th>
                <th>Team members</th>
                <th>Start Date</th>
                <th>Deadline</th>
                <th>Tech Stack</th>
                <th>Deactivate/Activate</th>
                <th>Usecase</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{projectData.Title}</td>
                <td>{projectData.Email}</td>
                <td className="scrollable-cell1">{projectData.Description}</td>
                <td>{projectData.Team}</td>
                <td>{projectData.Startdate}</td>
                <td>{projectData.Deadline}</td>
                <td>{projectData.Tools}</td>
                <td>
                  {activationStates[0] ? (
                    <button
                      id="deac-btn1"
                      onClick={() => {
                        handleSoftDelete(projectData.Projectid, 0);
                        notify1();
                      }}
                      style={{ marginLeft: "15px" }}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      id="deac-btn2"
                      onClick={() => {
                        cancelSoftDelete(projectData.Projectid, 0);
                        notify2();
                      }}
                      style={{ marginLeft: "15px" }}
                    >
                      Activate
                    </button>
                  )}
                </td>
                {/* <td><span onClick={() => {handleTaskButtonClick(projectData.Title) }} style={{ marginLeft: "5px" }}><BiTask size={20} style={{ marginLeft: "20px", color: "#47d86b" }} /></span></td> */}
                <td>
                  <span
                    className="viewusecase1"
                    onClick={() => {
                      handleTaskButtonClick(
                        projectData.Title,
                        projectData.Email
                      );
                    }}
                    id="usecase-nav"
                  >
                    <FcViewDetails size={20} />
                  </span>
                </td>
                <td>
                  <button
                    id="down-btn1"
                    onClick={() => downloadCSV([projectData])}
                  >
                    <IoCloudDownloadOutline
                      size={25}
                      style={{ color: "grey" }}
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Render the toggle bar */}
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
          <button onClick={downloadAllCSV2} id="down-al2">
            Download csv
          </button>
        </div>
      </div>
    </>
  );
};

export default Admin;

//  import axios from 'axios';
// import React, { useState,useEffect,useCallback} from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {  Zoom }  from 'react-toastify';
// import TextField from '@mui/material/TextField';
// import { IoCloudDownloadOutline } from "react-icons/io5";
// import { IoSearchOutline } from "react-icons/io5";
// import { IoClose } from "react-icons/io5";
// import { BiTask } from "react-icons/bi";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { FiSearch } from "react-icons/fi";

// const Admin = () => {
//     const navigate = useNavigate();
//     const [data, setData] = useState([]);
//     const [taskData, setTaskData] = useState([]);
//     const [activationStates, setActivationStates] = useState([]);
//     const [projectData, setProjectData] = useState(null);
//     const [projectTitle, setProjectTitle] = useState('');
//     const [showSearchBar, setShowSearchBar] = useState(false);
//     const [showTab1, setShowTab1] = useState(true);
//     const [searchPerformed, setSearchPerformed] = useState(false);

//     useEffect(() => {
//         fetchData1();
//         fetchData2();
//     }, []);

//     const fetchData1 = async () => {
//         try {
//             const response = await fetch('http://localhost:4023/project_info');
//             const jsonData = await response.json();
//             setData(jsonData);
//             setActivationStates(Array(jsonData.length).fill(true));
//         } catch (error) {
//             console.error('Error fetching data: ', error);
//         }
//     };

//     const fetchData2 = async () => {
//         try {
//             const response = await fetch('http://localhost:4023/project_info1');
//             const jsonData = await response.json();
//             setTaskData(jsonData);
//         } catch (error) {
//             console.error('Error fetching data: ', error);
//         }
//     };

//     const handleSoftDelete = async (Projectid, index) => {
//         try {
//             await axios.put(`http://localhost:4023/api/project_info/delete/${Projectid}`);
//             const newActivationStates = [...activationStates];
//             newActivationStates[index] = false;
//             setActivationStates(newActivationStates);
//         } catch (error) {
//             console.error('Error soft deleting project:', error);
//         }
//     };

//     const cancelSoftDelete = async (Projectid, index) => {
//         try {
//             await axios.put(`http://localhost:4023/api/project_info/canceldelete/${Projectid}`);
//             const newActivationStates = [...activationStates];
//             newActivationStates[index] = true;
//             setActivationStates(newActivationStates);
//         } catch (error) {
//             console.error('Error soft deleting project:', error);
//         }
//     };

//     const downloadCSV = (data) => {
//         const csvContent = "data:text/csv;charset=utf-8," + data.map(row => Object.values(row).join(',')).join('\n');
//         const encodedUri = encodeURI(csvContent);
//         const link = document.createElement("a");
//         link.setAttribute("href", encodedUri);
//         link.setAttribute("download", "data.csv");
//         document.body.appendChild(link);
//         link.click();
//     };

//     const downloadAllCSV1 = () => {
//         downloadCSV(data);
//     };

//     const downloadAllCSV2 = () => {
//         downloadCSV(taskData);
//     };

//     const notify1 = () => toast.error("Deactivated successfully", { transition: Zoom });
//     const notify2 = () => toast.success("Activated successfully");

//     const handleTaskButtonClick = (title, email) => {
//         navigate("/usecaseReadEdit", { state: { title, email } });
//     };

//     const toggleSearchBar = () => {
//         setShowSearchBar(!showSearchBar);
//     };

//     const clearSearch = () => {
//         setProjectData(null);
//         setProjectTitle('');
//         setSearchPerformed(false);
//     };

//     const handleChange1 = (event) => {
//         setProjectTitle(event.target.value);
//     };

//     const searchProject = async () => {
//         try {
//             const response = await fetch(`http://localhost:4023/project_info1/title/${projectTitle}`);
//             if (!response.ok) {
//                 throw new Error("Failed to fetch");
//             }
//             const ans = await response.json();
//             if (ans.length > 0) {
//                 setProjectData(ans[0]);
//             } else {
//                 setProjectData(null);
//             }
//             setSearchPerformed(true);
//         } catch (error) {
//             console.log(error);
//             setProjectData(null);
//             setSearchPerformed(true);
//         }
//     };

//     const [toggleBarOpen, setToggleBarOpen] = useState(false);
//     const closeToggleBar = () => {
//         setToggleBarOpen(false);
//         setShowTab1(true);
//     };

//     return (
//         <>
//             <span id='all' style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>All Projects<IoMdArrowDropdown size={15} id='all-icon' /></span>
//             <button onClick={downloadAllCSV1} id='down-al' style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>Download csv</button>
//             <span id='search1' onClick={toggleSearchBar}><FiSearch size={20} /></span>
//             {showSearchBar && (
//                 <>
//                     <TextField
//                         id="user-ID"
//                         name='ID'
//                         value={projectTitle}
//                         onChange={handleChange1}
//                         label="Search"
//                         variant="standard"
//                         style={{ marginLeft: '400px' }}
//                     />
//                     <span onClick={clearSearch} id='search-close' style={{ color: "grey" }}><IoClose size={20} /></span>
//                     <span id='search-icon' onClick={searchProject}><IoSearchOutline size={16} /></span>
//                 </>
//             )}

//             {searchPerformed ? (
//                 projectData ? (
//                     <div id="tab1" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>Title</th>
//                                     <th>Email</th>
//                                     <th>Description</th>
//                                     <th>Team members</th>
//                                     <th>Start Date</th>
//                                     <th>Deadline</th>
//                                     <th>Tech Stack</th>
//                                     <th>Deactivate/Activate</th>
//                                     <th>Daily Task</th>
//                                     <th>Download</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td>{projectData.Title}</td>
//                                     <td>{projectData.Email}</td>
//                                     <td>{projectData.Description}</td>
//                                     <td>{projectData.Team}</td>
//                                     <td>{projectData.Startdate}</td>
//                                     <td>{projectData.Deadline}</td>
//                                     <td>{projectData.Tools}</td>
//                                     <td>
//                                         {activationStates[0] ? (
//                                             <button id='deac-btn1' onClick={() => { handleSoftDelete(projectData.Projectid, 0); notify1(); }} style={{ marginLeft: "15px" }}>Deactivate</button>
//                                         ) : (
//                                             <button id='deac-btn2' onClick={() => { cancelSoftDelete(projectData.Projectid, 0); notify2(); }} style={{ marginLeft: "15px" }}>Activate</button>
//                                         )}
//                                     </td>
//                                     <td><span onClick={() => { handleTaskButtonClick(projectData.Title, projectData.Email) }} style={{ marginLeft: "5px" }}><BiTask size={20} style={{ marginLeft: "20px", color: "#47d86b" }} /></span></td>
//                                     <td><button id='down-btn1' onClick={() => downloadCSV([projectData])}><IoCloudDownloadOutline size={25} style={{ color: "grey" }} /></button></td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div id="tab1" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>
//                         <p style={{ textAlign: 'center', color: 'red' }}>Title not found</p>
//                     </div>
//                 )
//             ) : (
//                 <div id="tab2" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Email</th>
//                                 <th>Description</th>
//                                 <th>Team members</th>
//                                 <th>Start Date</th>
//                                 <th>Deadline</th>
//                                 <th>Tech Stack</th>
//                                 <th>Deactivate/Activate</th>
//                                 <th>Usecase</th>
//                                 <th>Download</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {data.map((obj, Index) => (
//                                 <tr key={obj.Projectid}>
//                                     <td>{obj.Title}</td>
//                                     <td>{obj.Email}</td>
//                                     <td>{obj.Description}</td>
//                                     <td>{obj.Team}</td>
//                                     <td>{obj.Startdate.substring(0, 10)}</td>
//                                     <td>{obj.Deadline.substring(0, 10)}</td>
//                                     <td>{obj.Tools}</td>
//                                     {activationStates[Index] ? (
//                                         <td>
//                                             <button id='deac-btn1' onClick={() => { handleSoftDelete(obj.Projectid, Index); notify1(); }}>Deactivate</button>
//                                         </td>
//                                     ) : (
//                                         <td>
//                                             <button id='deac-btn2' onClick={() => { cancelSoftDelete(obj.Projectid, Index); notify2(); }}>Activate</button>
//                                         </td>
//                                     )}
//                                     <td><span onClick={() => { handleTaskButtonClick(obj.Title, obj.Email) }} id='usecase-nav'>Usecase</span></td>
//                                     <td><button id='down-btn1' onClick={() => downloadCSV([obj])}><IoCloudDownloadOutline size={25} style={{ color: "grey" }} /></button></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             <div className={`toggle-bar ${toggleBarOpen ? 'open' : ''}`}>
//                 <div className="toggle-bar-content">
//                     <table id='mini1'>
//                         <thead>
//                             <tr>
//                                 <th>Usecase</th>
//                                 <th>Date</th>
//                                 <th>Time</th>
//                                 <th>Daily Task</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {Array.isArray(taskData) && taskData.map((obj) => (
//                                 <tr key={obj.ID}>
//                                     <td>{obj.usecasetitle}</td>
//                                     <td>{obj.Date.substring(0, 10)}</td>
//                                     <td>{obj.Time}</td>
//                                     <td>{obj.Dailytask}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <span onClick={closeToggleBar}><IoClose /></span>
//                     <button onClick={downloadAllCSV2} id='down-al2'>Download csv</button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Admin;
