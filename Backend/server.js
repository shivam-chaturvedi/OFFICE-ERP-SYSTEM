const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.routes");
const deptRoutes = require("./routes/department.routes");
const teamRoutes = require("./routes/team.routes");
const taskRoutes = require("./routes/task.routes");
const path = require("path");
const accountRoutes = require("./routes/account.routes");
const leaveRoutes = require("./routes/leave.routes");
const permissionRoutes = require("./routes/permission.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const attendanceRoutes = require("./routes/attendence.routes");
const internRoutes = require("./routes/intern.routes");

require("dotenv").config();

const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  authMiddleware.verifyToken([
    "/api/auth/login",
    "/api/auth/verify-token",
    "/profiles",
  ])
);
app.use("/profiles", express.static(path.join(__dirname, "profiles")));

mongoose
  .connect("mongodb://localhost:27017/erpdb")
  .then(async () => {
    const alreadyExists = await User.findOne({ email: "admin@gmail.com" });
    if (alreadyExists) {
      console.log("Already Exists Admin User " + alreadyExists);
    } else {
      const pass = await bcrypt.hash("admin", 10);
      try {
        const adminUser = await User.create({
          name: "admin",
          roles: ["admin"],
          position: "ADMIN",
          phone: "1234567891",
          email: "admin@gmail.com",
          password: pass,
        });
        console.log("Created Admin User " + adminUser);
      } catch (err) {
        console.log(err.message);
      }
    }
  })
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/attendence", attendanceRoutes);
app.use("/api/interns", internRoutes);

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port localhost:${PORT}`);
});
