const express = require("express");
const session = require("express-session");
const dbConnect = require("./dbconnect");
const User = require("./model");
const ejs = require("ejs");
const passport = require("passport");
const {intializingpassport, isAuthenticateuser} = require("./passportConfig");

const port = 8080;

const app = express();

// Connection to DataBase.
dbConnect();

// Connect to passport authentication.
intializingpassport(passport);

// this are middleware to read data coming from user in JSON() format.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup (needed for persistent login sessions)
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// set ejs due to this view engine ejs we are able to view all the UI of ejs.
app.set("view engine", "ejs");

// Passport initialization and session handling
app.use(passport.initialize());
app.use(passport.session());

// route
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).send("User already exists");
      }
  
      // If user does not exist, create a new user
      const newUser = await User.create(req.body);
      res.status(201).send(`New user created: ${newUser}`);
    } catch (err) {
      res.status(500).send(`Internal Server Error: ${err}`);
    }
  });

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/",
  })
  // async (req, res) => {}
);

// Here we are creating one more routes which will only be accessed by logined User.
 

// to Authenticate we will create one function is apssport.js for authentication.
app.get("/profile", isAuthenticateuser,(req,res)=> {
    //  console.log("logined users only");

    //  passport will get the user if the user is logined from the passport. 
     res.send(req.user);
});


// A method for Logout.

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err); // If there's an error, pass it to the next middleware (or error handler)
      }
      res.redirect("/register"); // Redirect to the homepage after successful logout
    });
  });



app.listen(port, () => {
  console.log("app is listening on:", port);
});
