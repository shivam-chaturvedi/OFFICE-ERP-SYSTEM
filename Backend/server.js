const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  authMiddleware.verifyToken(["/api/auth/login", "/api/auth/verify-token"])
);

mongoose
  .connect("mongodb://localhost:27017/erpdb")
  .then(async () => {
    const alreadyExists=await User.findOne({email:"admin@gmail.com"})
    if(alreadyExists){
      console.log("Already Exists Admin User "+ alreadyExists)
      
    }else{
    const pass =await bcrypt.hash("admin", 10);
    try {
      const adminUser = await User.create({
        name: "admin",
        role: "admin", 
        position: "ADMIN",
        phone: "1234567891",
        email: "admin@gmail.com", 
        password: pass,
      });
      console.log("Created Admin User "+adminUser)
    } catch (err) {  
      console.log(err.message);
    }
  } 
  })
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port localhost:${PORT}`);
});
