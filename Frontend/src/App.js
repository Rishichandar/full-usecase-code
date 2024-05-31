import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Loginpage } from "./pages/LoginPage/loginpage";
import Register from "./pages/RegisterPage/register";
import Main from "./pages/MainPage/main";
import Forgot from "./pages/ForgotPassPage/forgot.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Resetpage from "./pages/ResetPasspage/resetpage.js";
import Datas from "./Component/Data/datas.js";
import UserMenu from "./Component/usermenu.js";
import { ErrorPage } from "./pages/error/errorpage.js";
import Admin from "./Usecase/Allpages/Admin.js";
import Projectdetails from "./Usecase/projectdetails/project-details";
import "./Usecase/projectdetails/project.css"
import Task from "./Usecase/Allpages/Signup.js";
import Sidebar1 from "./Usecase/Sidebar/sidebar";
import "./Usecase/Title/title.css";
import User from "./Usecase/Allpages/User.js";
import Navbar from "./Usecase/Navbar/navbar.js";
import "./Usecase/Navbar/navbar.css"
import "./Usecase/Sidebar/sidebar.css";
import "./Usecase/rightdiv/right-cont.css";
import "./Usecase/Allpages/table.css";
import "./Usecase/Allpages/user.css";
import "./Usecase/Allpages/taskdetails.css";
import { Home } from "./Usecase/Allpages/home.jsx";
import Usecase from "./Usecase/Allpages/Usecase.js"
import "./Usecase/Allpages/usecase.css"
import { UsecaseReadEdit } from "./Usecase/Allpages/usecaseReadEdit.js";
import "./Usecase/Allpages/usecaseReadEdit.css"
import { ProtectedRoute } from "./CommonComponenets/ProtectedRoute/protectedRoute.jsx";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Router>
        <Routes>
          {/* <Route path="/login" element={<Loginpage />} /> */}
          <Route index action={Loginpage} element={<Loginpage />} />
          <Route path="/forgotpass" element={<Forgot />} />
          <Route path="reset" element={<Resetpage />} />
          <Route
            path="/"
            element={<ProtectedRoute />}
            errorElement={<ErrorPage />}
          >
            <Route path="register" element={<Register />} />
            <Route
              path="main"
              element={
                <>
                  <Sidebar1 />
                  <Main />
                </>
              }
            />
            <Route
              path="allData"
              element={
                <>
                  <Sidebar1 />
                  <Datas />
                </>
              }
            />
            </Route>
            <Route
              path="/usecase"
              element={
                <>
                  <Navbar />
                  <Sidebar1 />
                  <Usecase />
                </>
              }
            />
            <Route
              path="/usecaseReadEdit"
              element={
                <>
                  <Navbar />
                  <Sidebar1 />
                  <UsecaseReadEdit />
                </>
              }
            />

            {/* forgot pass */}

            {/* from rishi */}

            <Route
              path="/home"
              element={
                <>
                  <Navbar />
                  <Sidebar1 />
                  <Home />
                </>
              }
            />
            <Route
              path="/admin"
              element={
                <>
                  <Navbar />
                  <Sidebar1 />
                  <Admin />
                </>
              }
            />
            <Route
              path="/projectdetails"
              element={
                <>
                  <Navbar />
                  <Sidebar1 />
                  <Projectdetails />
                </>
              }
            />
            <Route
              path="/user"
              element={
                <>
                  <Navbar />
                  <Sidebar1 />
                  <User />
                </>
              }
            />
            <Route
              path="/task"
              element={
                <>
                  <Navbar />
                  <Sidebar1 />
                  <Task />
                </>
              }
            />
          
          <Route
            path="*"
            element={
              <main
                style={{
                  // padding: "5rem",
                  // fontSize: "2rem",
                  // textAlign: "center",
                  width: "100vw",
                  height: "100vh",
                }}
              >
                <div style={{ display: "grid", placeItems: "center" }}>
                  <div
                    class="container"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <h1 style={{ fontSize: "72px", margin: "0px" }}>404</h1>
                    <p style={{ fontSize: "24px" }}>
                      Oops! The page you are looking for cannot be found.
                    </p>
                    <a
                      style={{
                        backgroundColor: "#007BFF",
                        borderRadius: "5px",
                        color: "white",
                        textDecoration: "none",
                        marginTop: "20px",
                        padding: "10px 20px",
                        fontSize: " 18px",
                      }}
                      href="/"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              </main>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

