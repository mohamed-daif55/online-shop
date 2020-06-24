const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const multerAddProductImage = require("./functions/multerAddProductImage");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");

require("./db/mongoose");

const app = express();

// using session to store looged user into database
const store = new MongoDBStore({
    uri : process.env.MONGODB_URL,
    collection : "session"
});

// for securiing site
const csrfProtection = csrf();

// the running port
const PORT = process.env.PORT;

// set engine and pages folder
app.set("view engine", "ejs");
app.set('views', 'views');

// securing response header
app.use(helmet());
// reducing file size
app.use(compression());
// get req.body data
app.use(bodyParser.urlencoded({extended : true}));
// customize file directory
app.use(express.static(path.join(__dirname, "public")));
// customize stored images to preview
app.use("/images",express.static(path.join(__dirname, "images")));
// use sission to identify logged user
app.use(session( {secret : process.env.SESSION_SECRET, resave : false, saveUninitialized : false, store} ));
// for security
app.use(csrfProtection);
// used for handeling error message appearance
app.use(flash());
// to store images
app.use(multer({storage : multerAddProductImage.fileStorage, fileFilter : multerAddProductImage.fileFilter}).single("image"));
// public variables
app.use( (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
// use admin and shop routes
app.use(shopRoutes);
app.use(adminRoutes);
// handeling 404 page not found
app.use("*", (req, res) => {
    res.render("404",{
        pageTitle : "404 Error",
        isAdmin : false
    });
});
// listening to the running port
app.listen(PORT, () => {
    console.log("The app is up and runing on server", PORT);
});