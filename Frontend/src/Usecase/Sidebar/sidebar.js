import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FiMenu, FiArrowLeftCircle } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { useSelector } from "react-redux";


const Sidebar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleProjectManagementClick = () => {
    setSelectedItem(selectedItem === "ProjectManagement" ? null : "ProjectManagement");
  };
  const handlePortfolioManagementClick = () => {
    setSelectedItem(selectedItem === "PortfolioManagement" ? null : "PortfolioManagement");
  };
  const handleAttendanceManagementClick = () => {
    setSelectedItem(selectedItem === "AttendanceManagement" ? null : "AttendanceManagement");
  };

  // const data = useSelector((state) => state.auth.user);
  // console.log("hiii",data.Email)
  const roleid=useSelector((state)=>state.auth.user.RoleId)
  console.log("roleid :",roleid);

  return (
    <section className="page sidebar-2-page">
      <aside className={`sidebar-2 ${isOpen ? "open" : ""}`}>
        <div className="inner">
          <header>
            <button
              type="button"
              className="sidebar-2-burger"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="open-nav">
                {isOpen ? (
                  <FiArrowLeftCircle size={20} style={{ color: "#ffffff" }} />
                ) : (
                  <FiMenu size={20} style={{ color: "#ffffff" }} />
                )}
              </span>
            </button>
          </header>
          <nav>
           
            <button type="button" onClick={handleAttendanceManagementClick}>
              <span >
              <Link to="/main"><RiAdminFill size={18} color="white" /></Link>
              </span>
             <Link to="/main" style={{textDecoration:"none"}}> <p className="navbar-item">Attendance</p></Link>
            </button>
            
            <button type="button" onClick={handleProjectManagementClick}>
              <span>
              <Link to="/home"><LiaProjectDiagramSolid size={22} color="white"/></Link>
              </span>
             <Link  to="/home"style={{textDecoration:"none"}}><p className="navbar-item">Project</p></Link> 
            </button>
            {/* while clicking AttendanceManagement */}
            {selectedItem === "AttendanceManagement" && (
              <>
              
              </>
            )}
            {/* project management clicking */}
            {selectedItem === "ProjectManagement" && (
              <>
               <div id="proj-div3">
                
                {roleid === 1 && (
                <Link to="/admin" style={{ textDecoration: "none" }}className="material-symbols-outlined">
                  <button type="button"id="nav-button">
                    <span >
                      <RiAdminFill  />
                    </span>
                    <p className="navbar-item2">Admin</p>
                  </button>
                </Link>
                  )}
                <Link to="/user" style={{ textDecoration: "none" }}className="material-symbols-outlined">
                  <button type="button"id="nav-button">
                    <span >
                      <FaUserCircle />
                    </span>
                    <p className="navbar-item2">Details</p>
                  </button>
                </Link>
               
                </div> 
              </>
            )}
          </nav>
        </div>
      </aside>
    </section>
  );
};

export default Sidebar1;


 