const express = require("express");
var cors = require("cors");
const connectToMongo = require("./utils/db.js");
const globalErrorHandler = require("./middlewares/error.js");

connectToMongo();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });
app.use("/brand", require("./routes/brandRouter"));
app.use("/order", require("./routes/orderRouter"));
app.use("/part", require("./routes/partRouter"));
app.use("/warehouse", require("./routes/warehouseRouter"));

//error handling
app.all("*", (req, res, next) => {
  //AppError class for error handler object
  next(new AppError(`Cannot find route ${req.originalUrl} in the server`));
});

//error middle ware whenever first arg is err object it is error middleware
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
