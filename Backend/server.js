require("dotenv").config();
const express = require("express");
const db = require("./app/node-mysql-server/db-con");
const app = express();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const cors = require("cors");
app.use(cors());
app.use(express.json());
const swaggerui = require("swagger-ui-express");
const swaggerDocument = require("./app/SwaggerSpecs/swagger.json");
const routePath = require("./app/controllers/routes/auth");
const { GenericResponse, ResponseStatus } = require("./GenericResponse");

// !  FOR CREATE
app.use("/user/create", routePath);
// !  FOR LOGIN
app.use("/user/login", routePath);
// !  FOR AUTH
app.use("/", routePath);
// !  FOR RESET PASS
app.use("/user/reset", routePath);

// !  FOR FORGOTPASS
app.use("/user/forgot", routePath);
// !  Fetching single data
app.use("/singleData", routePath);

app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument));
// *  IN THIS LINE CORS IS USED TO PASS THE DATA TO REACT

// *  THIS IS IMPORTANT ONE FOR API CATCH

// !  FETCH ALL
app.use("/user/fetch", routePath);

app.use("/attendance_app", routePath);

app.use("/alldatas", routePath);

app.use("/GetActivity", routePath);

app.use("/data", routePath);

app.use("/user/reg", routePath);

app.use("user/audit", routePath);

const port = process.env.PORT || 4023;



// * -------------------------- USE CASE API----------------------------
app.get("/landscape", (req, res) => {

const sql = `SELECT 
Userid, 
date, 
GROUP_CONCAT(CASE WHEN activity_type = 'Time In' THEN time END ORDER BY time) AS Timein,
-- MIN(CASE WHEN activity_type = 'Time In' THEN time END) AS Timein,
GROUP_CONCAT(CASE WHEN activity_type = 'breakin' THEN time END ORDER BY time) AS Breakin, 
-- MAX(CASE WHEN activity_type = 'breakin' THEN time END) AS Breakin, 
GROUP_CONCAT(CASE WHEN activity_type = 'breakout' THEN time END ORDER BY time) AS Breakout, 
-- MAX(CASE WHEN activity_type = 'breakout' THEN time END) AS Breakout, 
GROUP_CONCAT(CASE WHEN activity_type = 'lunchin' THEN time END ORDER BY time) AS Lunchin, 
-- MAX(CASE WHEN activity_type = 'lunchin' THEN time END) AS Lunchin, 
GROUP_CONCAT(CASE WHEN activity_type = 'lunchout' THEN time END ORDER BY time) AS Lunchout, 
-- MAX(CASE WHEN activity_type = 'lunchout' THEN time END) AS Lunchout, 
GROUP_CONCAT(CASE WHEN activity_type = 'Time Out' THEN time END ORDER BY time) AS Timeout,
-- MAX(CASE WHEN activity_type = 'Time Out' THEN time END) AS Timeout,
-- MAX(CASE WHEN comments IS NOT NULL THEN comments END) AS Comments  Adding comments section-- Assuming activity_comment is the correct column name for comments
GROUP_CONCAT(comments SEPARATOR ', ') AS Comments -- Concatenate comments)
FROM 
pulse.time_table
WHERE 
date = UTC_DATE()
GROUP BY 
Userid, date 
ORDER BY 
Userid`; 
db.query(sql, function (error, result) {
  if (error) {
    return res.json(error);
  } else {
    return res.json(result);
  }
});
 });

app.put("/api/project_info/delete/:Projectid", (req, res) => {
  const projectId = req.params.Projectid;

  const sql = "UPDATE project_info SET is_deleted = 1 WHERE Projectid = ?";
  db.query(sql, [projectId], (error, result) => {
    if (error) {
      console.error("Error soft deleting project details:", error);
      return res.status(500).json({ error: "Internal app error" });
    }
    res
      .status(200)
      .json({ message: "Project details soft deleted successfully" });
  });
});
// Cancel Soft delete project details by ID
app.put("/api/project_info/canceldelete/:Projectid", (req, res) => {
  const projectId = req.params.Projectid;

  const sql = "UPDATE project_info SET is_deleted = 0 WHERE Projectid = ?";
  db.query(sql, [projectId], (error, result) => {
    if (error) {
      console.error("Error soft deleting project details:", error);
      return res.status(500).json({ error: "Internal app error" });
    }
    res
      .status(200)
      .json({ message: "Project details soft deleted successfully" });
  });
});
//creating record

//post(updated)
app.post("/project_infos", (req, res) => {
  const sql =
    "INSERT INTO project_info (`Title`,`Email`,`Description`,`Team`,`Startdate`,`Deadline`,`Tools`,`Files`) Values (?)";
  let details = [
    req.body.Title,
    req.body.Email,
    req.body.Description,
    req.body.Team,
    req.body.Startdate,
    req.body.Deadline,
    req.body.Tools,
    req.body.Files,
  ];
  //execute query

  db.query(sql, [details], (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log("hi");
      return res.json(data);
    }
  });
});

// app.post("/taskdetails", (req, res) => {
//   const { taskDetails, emailid, Title, summary } = req.body;
//   const currentDate = new Date();
//   const formattedDate = currentDate.toISOString().slice(0, 10);
//   const formattedTime = currentDate.toISOString().slice(11, 19);

//   const query =
//     "INSERT INTO taskdetails (Date, Time, Dailytask, Email, Title, usecasetitle) VALUES (?, ?, ?, ?, ?,?)";
//   db.query(
//     query,
//     [formattedDate, formattedTime, taskDetails, emailid, Title, summary],
//     (err, results) => {
//       if (err) {
//         console.error("Error executing MySQL query:", err);
//         res.status(500).json({ error: "Failed to add task" });
//         return;
//       }
//       console.log("Task added");
//       res.status(200).json({ message: "Task added successfully" });
//     }
//   );
// });
app.post("/taskdetails", (req, res) => {
  const { taskDetails, emailid, Title, summary } = req.body;

  // Get current system date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
  const formattedTime = currentDate.toTimeString().slice(0, 8); // Format: HH:MM:SS

  // SQL query to insert task details
  const query =
    "INSERT INTO taskdetails (Date, Time, Dailytask, Email, Title, usecasetitle) VALUES (?, ?, ?, ?, ?, ?)";

  // Execute the query with the provided values
  db.query(
    query,
    [formattedDate, formattedTime, taskDetails, emailid, Title, summary],
    (err, results) => {
      if (err) {
        console.error("Error executing MySQL query:", err);
        8;
        res.status(500).json({ error: "Failed to add task" });
        return;
      }
      console.log("Task added successfully");
      res.status(200).json({ message: "Task added successfully" });
    }
  );
});

//(updated)for view the records and get the data in database
app.get("/project_info", (req, res) => {
  const sql = "SELECT * FROM project_info";
  db.query(sql, function (error, result) {
    if (error) {
      return res.json(error);
    } else {
      return res.json(result);
    }
  });
});

//(updated)for view the login user records and get the data in database
app.get("/project_infouser", (req, res) => {
  const userEmail = req.query.email; // Extract email from query parameters
  const sql = "SELECT * FROM project_info WHERE email = ?"; // Adjust SQL query
  db.query(sql, [userEmail], function (error, result) {
    if (error) {
      return res.json(error);
    } else {
      return res.json(result);
    }
  });
});

app.get("/task_details/:summary", (req, res) => {
  let Projecttitle = req.params.summary; // Use lowercase 'title'
  let query = `SELECT * FROM taskdetails WHERE usecasetitle = ?`;

  db.query(query, [Projecttitle], (err, results) => {
    // Use lowercase 'title' here as well
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.json({ error: "Internal app error" });
      return;
    }

    // Check if task details were found for the title
    if (results.length === 0) {
      res
        .status(404)
        .json({ Error: "No task details found for the title provided" }); // Changed to 404 status
      console.log(err);
      return;
    }

    // Task details found, send them in the response
    res.json(results);
  });
});

//for getting single value based on id
app.get("/project_info/:Projectid", (req, res) => {
  let personID = req.params.Projectid;
  let query = `SELECT * FROM project_info WHERE Projectid in (?) AND  is_deleted=0`; //`SELECT * FROM project_info WHERE Projectid =${personID}`

  db.query(query, personID, (err, results) => {
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.json({ error: "Internal app error" });
      return;
    }
    // Check if person exists
    if (results.length === 0) {
      res.json({ error: "Person not found" });
      return;
    }

    // Person found, send person data in response
    res.json(results[0]);
  });
});
//// for getting single value based on project-title ( /projectdetails/:Project_Title)
app.get("/project_info1/:Title", (req, res) => {
  let title = req.params.Title;
  let query = `SELECT * FROM project_info WHERE Title = ? AND is_deleted = 0`;

  db.query(query, [title], (err, results) => {
    if (err) {
      console.error("Error querying MySQL database:", err);
      res.json({ error: "Internal app error" });
      return;
    }

    // Check if project exists
    if (results.length === 0) {
      res.json({ error: "Project not found" });
      return;
    }

    // Project found, send project data in response
    res.json(results[0]);
  });
});

app.put("/api/update/:Title", (req, res) => {
  const projectTitle = req.params.Title;
  let editedData = req.body;

  // Removing projectid from editedData if it exists
  if (editedData.hasOwnProperty("projectid")) {
    delete editedData.projectid;
  }

  // Changing date format correctly
  if (editedData.Startdate) {
    const startdate = new Date(editedData.Startdate);
    editedData.Startdate = startdate.toISOString().split("T")[0]; //format yyyy-mm-dd
  }
  if (editedData.Deadline) {
    const deadline = new Date(editedData.Deadline);
    editedData.Deadline = deadline.toISOString().split("T")[0]; //format yyyy-mm-dd
  }

  // Update the corresponding row in the database
  db.query(
    "UPDATE project_info SET ? WHERE Title = ?",
    [editedData, projectTitle],
    (error, results) => {
      if (error) {
        console.error("Error updating data:", error);
        res.status(500).send("Error updating data in the database");
        return;
      }
      res.status(200).send("Data updated successfully");
    }
  );
});

app.post("/usecase", (req, res) => {
  const formData = req.body;

  // Extracting the date part only from formData.enddate
  const endDate = formData.enddate
    ? new Date(formData.enddate).toISOString().split("T")[0]
    : null;

  const sql =
    "INSERT INTO usecase (`summary`, `team`, `status`, `enddate`, `attachment`, `reporterid`, `description`,`title`) VALUES (?, ?, ?, ?, ?, ?,?,?)";
  const values = [
    formData.summary,
    formData.team,
    formData.status,
    endDate, // Using the extracted date part
    formData.attachment,
    formData.reporterid,
    formData.description,
    formData.title,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding use case:", err);
      res.status(500).send("Failed to add use case");
      return;
    }
    console.log("Use case added successfully");
    res.status(201).send(result);
  });
});

app.get("/usecases", (req, res) => {
  const { title } = req.query;
  let sql = "SELECT * FROM usecase"; // Assuming your table is named "usecases"

  // If email is provided, add a WHERE clause to filter results by email
  if (title) {
    sql += ` WHERE title = '${title}'`;
  }

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error retrieving use cases" });
    } else {
      res.status(200).json(result);
    }
  });
});

//put method
app.put("/usecases/:id", (req, res) => {
  const { id } = req.params;
  const editedUsecase = req.body;

  // Convert ISO date format to MySQL date format
  editedUsecase.enddate = new Date(editedUsecase.enddate)
    .toISOString()
    .split("T")[0];

  const sql = "UPDATE usecase SET ? WHERE id = ?";
  db.query(sql, [editedUsecase, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error updating use case" });
      console.log(err);
    } else {
      res.status(200).json({ message: "Use case updated successfully" });
      console.log(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
