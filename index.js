const { default: mongoose } = require("mongoose");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const BasicStrategy = require('passport-http').BasicStrategy;

var indexRouter = require("./routes/index");
var productsRouter = require("./routes/products/router");
var categoryRouter = require("./routes/category/router");
var suppliersRouter = require("./routes/suppliers/router");
var customersRouter = require("./routes/customers/router");
var employeesRouter = require("./routes/employees/router");
var orderRouter = require("./routes/orders/router");
var questionRouter = require("./routes/questions/router");
var authRouter = require("./routes/auth/router");
var mediaRouter = require("./routes/media/router");
var userAuth = require("./routes/user/auth/router");
var cartRouter = require("./routes/user/cart/router")

const authCustomersRouter = require('./routes/authCustomer/router');
const authEmployeesRouter = require('./routes/authEmployee/router');
const vnPayRouter = require('./routes/vnPay/router');
const flashsaleRouter = require('./routes/flashsales/router');
const timeFlashsaleRouter = require('./routes/timeFlashsales/router');
const orderAdminRouter = require("./routes/orderAdmin/router");
const questionAdminRouter = require("./routes/questionsAdmin/router");
const productsAdminRouter = require("./routes/product-admin/router");
const queryOrderRouter = require("./routes/queryOrders/router");

const {
  passportVerifyTokenAdmin,
  passportVerifyAccountAdmin,
  // passportConfigBasic,
} = require('./middlewares/passportAdmin');

const {
  passportVerifyTokenUser,
  passportVerifyAccountUser,
  // passportConfigBasic,
} = require('./middlewares/passportUser');

var app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Add CORS here
app.use(
  cors({
    origin: "*",
  })
);
mongoose.connect(process.env.URI);
// passport.use(passportConfigBasic);
passport.use(new BasicStrategy(
  function (username, password, done) {

    User.findOne({ username: username }, function (err, user) {

      // if (err) { console.log('◀◀◀ username ▶▶▶',username) }
      // if (!user) { return done(null, false); }
      // if (!user.validPassword(password)) { return done(null, false); }
      return done('null', "aaaaa");
    });
  }
));

passport.use('jwtAdmin', passportVerifyTokenAdmin);
passport.use('localAdmin', passportVerifyAccountAdmin);

passport.use('jwtUser', passportVerifyTokenUser);
passport.use('localUser', passportVerifyAccountUser);

app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/categories", categoryRouter);
app.use("/suppliers", suppliersRouter);
app.use("/customers", customersRouter);
app.use("/employees", employeesRouter);
app.use("/orders", orderRouter);
app.use("/questions", questionRouter);
app.use("/auth", authRouter);
app.use("/media", mediaRouter);
app.use("/user", userAuth);
app.use("/cart", passport.authenticate('jwtUser', { session: false }), cartRouter);

app.use('/authCustomers', authCustomersRouter);
app.use('/authEmployees', authEmployeesRouter);
// app.use('/vnPay', passport.authenticate('jwtUser', { session: false }), vnPayRouter);
app.use('/vnPay', vnPayRouter);
app.use('/flashsale', flashsaleRouter);
app.use('/time-flashsale', timeFlashsaleRouter);
app.use('/orders-admin', orderAdminRouter);
app.use("/questions-admin", questionAdminRouter);
app.use("/products-admin", productsAdminRouter);
app.use("/query-orders", queryOrderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
