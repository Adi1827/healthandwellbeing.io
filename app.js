const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const db = require("./config/db");
const loginRoute = require("./routes/userLogin");
const authRoute = require("./routes/authUser");
const errorRoute = require("./routes/errorRoutes");
const cookieParser = require("cookie-parser");


dotenv.config();
const app = express();

db.authenticate()
.then(() => {
  console.log("Connection has been established successfully.");
})
.catch((err) => {
  console.error("Unable to connect to the database:", err.message);
});
db.sync();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

if (!process.env.SECRET_KEY) {
  throw new Error("Secret Key must be declared");
}

app.use("/", loginRoute, authRoute);
app.use("*",errorRoute);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Some error starting the server...", err);
    throw err;
  }
  console.log(`Server Started on http://localhost:${process.env.PORT}/login`);
});
