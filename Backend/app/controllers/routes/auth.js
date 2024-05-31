require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../node-mysql-server/db-con");
const { GenericResponse, ResponseStatus } = require("../../../GenericResponse");
const ErrorMessage = require("../../../ErrorMessage");
const { SendEmail } = require("../../Services/EmailService/EmailServe");

router.use(express.json());



const ActivityTypeList = [
  'Time In',
  'Time Out',
  'lunchin',
  'lunchout',
  'breakin',
  'breakout',
  'login', 
  'registered for this mail' ,
  'reseted',// Add 'register' to the valid activity types
  'Signout'
];
router.post('/user/audit', (req, res) => {
  const currentDate = new Date(); // Define currentDate
  const formattedDateTime = currentDate
    .toISOString()
    .slice(0, 19)
    .replace('T', ' '); // Format: YYYY-MM-DD HH:MM:SS

  const { User_id, Activity_type, App_data, Comments } = req.body;

  console.log('Received audit info:', req.body); // Log the received data for debugging

  let sql = 'INSERT INTO audit_info (User_id, Activity_type, Time, App_data, Comments) VALUES (?, ?, ?, ?, ?)';
  let values = [User_id, Activity_type, formattedDateTime, App_data, Comments];

  if (!ActivityTypeList.includes(Activity_type)) {
    return res.status(400).send('Invalid activity type');
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data into database');
    } else {
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
    }
  });
});

router.get("/GetActivity", (req, res) => {
  const email = req.query.Email;
  const filters = req.query.Filter;
  // let filterString = filters.map((x) => `'${x}'`).join(",");
  if (!email || !filters)
    return res
      .status(400)
      .json(
        new GenericResponse(
          ResponseStatus.Failure,
          ErrorMessage.MissingQuery,
          null
        )
      );
  const sql = `SELECT * FROM time_table WHERE Userid ='${email}'  AND Date = CURDATE() and Activity_type in (${filters})  ORDER BY Time`;
  db.query(sql, (error, data) => {
    if (error) {
      return res
        .status(400)
        .json(new GenericResponse(ResponseStatus.Failure, error.message, null));
    } else {
      return res.json(new GenericResponse(ResponseStatus.Success, null, data));
    }
  });
});

router.get("/attendance_app", (req, res) => {
  const sql = "SELECT * FROM time_table";
  db.query(sql, (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.json(data);
    }
  });
});

router.post("/attendance_app", (req, res) => {
  const { Date, Time, Userid, Activity_type, Comments } = req.body;

  let sql =
    "INSERT INTO time_table (Userid, Date, Time, Activity_type, Comments) VALUES (?, ?, ?, ?, ?)";
  //     values = [Userid, Date, Time, Activity_type, Comments];;
  let values = [Userid, Date, Time, Activity_type, Comments];

  const ActivityTypeList = [
    "Time In",
    "Time Out",
    "lunchin",
    "lunchout",
    "breakin",
    "breakout",
  ];
  if (!ActivityTypeList.includes(Activity_type))
    return res.status(400).send("Invalid activity type");

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Data inserted successfully");
    }
  });
});

router.get("/user/fetch", (req, res) => {
  const sql = "SELECT * FROM appuser";
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err.message });
    return res.json(data);
  });
});

router.get("/alldatas", (req, res) => {
  const sql = "SELECT * FROM time_table";
  db.query(sql, (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.json(data);
    }
  });
});

//! New route to fetch data by date this need to fix
router.get("/data", (req, res) => {
  const userEmail = req.query.email;
  const currentDate = req.query.date;

  const sql = "SELECT * FROM time_table WHERE Userid=? AND DATE(Date)=?";
  db.query(sql, [userEmail, currentDate], (err, data) => {
    if (err) {
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.SyntaxError,
            null
          )
        );
    }
    return res
      .status(200)
      .json(new GenericResponse(ResponseStatus.Success, null, data));
  });
});
router.get("/singleData", (req, res) => {
  const userEmail = req.query.email;
  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().slice(0, 10);

  const sql = "SELECT * FROM time_table WHERE Userid=? AND DATE(Date)=?";
  // const sql = "SELECT * FROM time_table WHERE Userid=?";
  // db.query(sql, [userEmail], (err, data) => {
  db.query(sql, [userEmail, currentDate], (err, data) => {
    if (err) {
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.SyntaxError,
            null
          )
        );
    }
    return res
      .status(200)
      .json(new GenericResponse(ResponseStatus.Success, null, data));
  });
});

router.post("/user/reg", async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res
      .status(400)
      .json(
        new GenericResponse(
          ResponseStatus.Failure,
          ErrorMessage.RequiredEmail,
          null
        )
      );
  }

  const htmlbody = `
    <p>Dear Team,</p>
    <p>We are pleased to announce the implementation of our new attendance application, 🎉 designed to streamline and improve our attendance tracking process. Starting today, all employees are required to use this application to mark their attendance.</p>
    <p>Here are the details for accessing the application:</p>
    <p><b>Application URL:</b><a href=" ${process.env.APP_LINK}">AttendanceAppLink</a><br>
    <b>Username:</b> ${Email}<br>
    <b>Password:</b> ${Password}</p>
    <p><strong>Steps To Get Started </strong></p>
    <ol>
      <li>Open your web browser and go to  <a href="${process.env.APP_LINK}">AttendanceAppLink</a></li>
      <li>Enter the username: "${Email}"  and the password: "${Password}"</li>
      <li>Once logged in, follow the prompts to set a new password of your choice.</li>
      <li>Familiarize yourself with the interface and features of the application</li>
    </ol>
    <p><strong>Important Points to Note:</strong></p>
    <p>Security: Please change your password immediately after the first login to ensure your account's security.</p>
    <p>Attendance Marking: Ensure you mark your attendance and break timings promptly as per the company policy.</p>
    <p>Support: If you encounter any issues or have any questions, please contact the Application Developer – <b>Thirumavalavan & Nandhini</b></p>
    <p>We believe this new system will enhance our operational efficiency and provide a more seamless experience for everyone. Your cooperation in transitioning to this new application is highly appreciated.</p>
    <p>Thank you for your attention to this matter and for your continued dedication to our team.</p>

    <i>
    <p>Regards,</p>
    <p>J Dhandapani<br>
    Project Manager<br>
    POZENT<br>
    Contact no: 6385154636<br>
    Email: <a href="mailto:dhandapani@devpozent.com">dhandapani@devpozent.com</a></p>
    <p>Pozent Corporation | <a href="http://www.pozent.com">www.pozent.com</a></p>
    </i>
  `;
  try {
    await SendEmail(
      "Start Using the New Attendance Application",
      htmlbody,
      Email
    );
    return res
      .status(200)
      .json(
        new GenericResponse(
          ResponseStatus.Success,
          null,
          "Registration email sent successfully."
        )
      );
  } catch (emailError) {
    console.error("Error sending registration email:", emailError);
    return res
      .status(500)
      .json(
        new GenericResponse(
          ResponseStatus.Failure,
          ErrorMessage.FailedMail,
          null
        )
      );
  }
});

router.post("/user/forgot", async (req, res) => {
  const sql = "SELECT * FROM appuser WHERE Email=?";
  const user = req.body.Email;
  db.query(sql, user, (err, data) => {
    if (err) {
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.SyntaxError,
            null
          )
        );
    }
    if (data.length === 0) {
      return res
        .status(404)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.UserNotFound,
            null
          )
        );
    }

    const token = jwt.sign(data[0], process.env.JWT_SecretKey, {
      expiresIn: "1h", //one hour
    });
    let htmlbody = `
    <p>You requested a password reset. Please use the link below to set a new password. This link is only valid for the next hour.</p>
    <p><a href="${process.env.FORGET_PASSWORD_LINK}${token}">Click here to Reset your password</a></p>
    <p><strong>Please do not reply to this email as it is an automated response.</strong></p>`;
    SendEmail("Reset your password", htmlbody, data[0].Email)
      .then((info) => {
        console.log("Email sent successfully: " + info.response);
        return res
          .status(200)
          .json(
            new GenericResponse(
              ResponseStatus.Success,
              null,
              "Email sent successfully: " + info.response
            )
          );
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.FailedMail,
              null
            )
          );
      });
  });
});

// ! REGISTER DATA WITH HASHED PASSWORD
router.post("/user/create", (req, res) => {
  const sql = "INSERT INTO appuser (Email, Password, RoleId) VALUES (?, ?, ?)";
  const { Email, RoleId } = req.body;
  const salt = 10;
  bcrypt.hash(req.body.Password.toString(), salt, (err, hash) => {
    if (err) {
      return res
        .status(500)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.HashError,
            null
          )
        );
    }

    // Construct the values array correctly to match the SQL placeholders.
    const values = [Email, hash, RoleId];

    db.query(sql, values, (err) => {
      if (err) {
        console.error("Database error:", err);
        // Handle duplicate entry error for emails
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json(
              new GenericResponse(
                ResponseStatus.Failure,
                ErrorMessage.DuplicateEmail,
                null
              )
            );
        }
        return res
          .status(401)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.SyntaxError,
              null
            )
          );
      }
      return res
        .status(200)
        .json(
          new GenericResponse(ResponseStatus.Success, null, "register success")
        );
    });
  });
});

// !    LOGINUSER
router.post("/user/login", (req, res) => {
  const sql = "SELECT * FROM appuser WHERE Email=?";
  const user = req.body.Email;
  db.query(sql, user, (err, data) => {
    if (err) {
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.SyntaxError,
            null
          )
        );
    }
    if (data.length > 0) {
      bcrypt.compare(
        req.body.Password.toString(),
        data[0].Password,
        (err, response) => {
          // Password Comparison Error
          if (err)
            return res
              .status(401)
              .json(
                new GenericResponse(
                  ResponseStatus.Failure,
                  ErrorMessage.MissMatch,
                  null
                )
              );
          if (response) {
            //  password comparison succeeds
            // JWT token is generated it contains (user data and secret key)
            const token = jwt.sign(data[0], process.env.JWT_SecretKey, {
              expiresIn: "6h",
            });
            // returned to the client it contains the token
            return res.status(200).json(
              new GenericResponse(ResponseStatus.Success, null, {
                Token: token,
              })
            );
          } else {
            // Password Mismatch
            return res
              .status(401)
              .json(
                new GenericResponse(
                  ResponseStatus.Failure,
                  ErrorMessage.Error,
                  null
                )
              );
          }
        }
      );
    } else {
      // User Existence Check
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.NoEmailExist,
            null
          )
        );
    }
  });
});

// !  AUTHENTICATING THE JWT TOKEN
router.get("/user/auth", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SecretKey);
      // If verification is successful, decoded will contain the payload of the token
      return res
        .status(200)
        .json(
          new GenericResponse(ResponseStatus.Success, null, { ...decoded })
        );
    } catch (error) {
      // If verification fails, jwt.verify() will throw an error
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.InvlidToken,
            null
          )
        );
    }
  } else {
    return res
      .status(401)
      .json(
        new GenericResponse(ResponseStatus.Failure, ErrorMessage.NoToken, null)
      );
  }
});

// !  UPDATE THE PASS

router.put("/user/reset", (req, res) => {
  // Assuming req.body contains 'Email' and 'NewPassword'
  const { Email, Password, ConfirmPassword } = req.body;

  // First, hash the new password
  const salt = 10;
  bcrypt.hash(Password.toString(), salt, (err, hashedPassword) => {
    if (err) {
      return res
        .status(500)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.HashError,
            null
          )
        );
    }

    // Then, update the password in the database
    const sql = `UPDATE appuser SET Password = ?,IsFirstLogin=0 WHERE Email = ?`;
    db.query(sql, [hashedPassword, Email], (err, data) => {
      if (err) {
        return res
          .status(401)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.MissMatch,
              null
            )
          );
      }

      if (data.affectedRows > 0) {
        // If the update was successful
        return res.status(200).json(
          new GenericResponse(ResponseStatus.Success, null, {
            message: "Password reset successfully",
          })
        );
      } else {
        return res
          .status(404)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.UserNotFound,
              null
            )
          );
      }
    });
  });
});
module.exports = router;
