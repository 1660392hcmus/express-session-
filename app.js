var express = require("express");
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
var app = express();
app.use(cookieParser());
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);
var auth = function(req, res, next) {
  console.log(req.session.user);
  if (req.session && req.session.user === "amy" && req.session.admin) {
    console.log("req.session", req.session);
    return next();
  } else return res.sendStatus(401);
};
app.get("/login", function(req, res) {
  if (!req.query.username || !req.query.password) {
    res.send("login failed");
  } else if (
    req.query.username === "amy" ||
    req.query.password === "amyspassword"
  ) {
    req.session.user = "amy";
    req.session.admin = true;
    // res.send(req.session.user);
    res.redirect("/content");
  }
});
app.get("/logout", function(req, res) {
  req.session.destroy();
  res.send("logout success!");
});
app.get("/content", auth, function(req, res) {
  res.send("You can only see this after you've logged in.");
});
app.listen(3000);
