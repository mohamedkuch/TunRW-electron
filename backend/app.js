const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");

const eventsRoutes = require("./routes/events");
const userRoutes = require("./routes/user");
const projectsRoutes = require("./routes/projects");
const partnersRoutes = require("./routes/partners");
const servicesRoutes = require("./routes/services");
const teamMembersRoutes = require("./routes/teamMembers");
const aboutRoutes = require("./routes/about");
const notificationsRoutes = require("./routes/notifications");

const app = express();

mongoose
  .connect(
    "mongodb+srv://Mohamed:"+ process.env.MONGO_ATLAS_PW + "@tunrwcluster-nwi9h.mongodb.net/node-angular",{ useUnifiedTopology: true , useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to Database !');
  })
  .catch(() => {
    console.log('Connection Failed !');
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(__dirname + '/images'));
app.use("/", express.static(path.join(__dirname, "angular")));


// use only in local
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();

});
// user mdp = Ckq8Ve7JLxDnLXCY

app.use("/api/events", eventsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/teamMembers", teamMembersRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});



module.exports = app;
