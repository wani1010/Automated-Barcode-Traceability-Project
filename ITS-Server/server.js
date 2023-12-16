const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// comment for normal run and for deployment uncomment
/* const open = require("open"); */

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// comment for normal run and for deployment uncomment
/* const host = "http://localhost:" + port; */

app.use(cors());
app.use(express.json());
// comment for normal run and for deployment uncomment
/* app.use(express.static(path.join(__dirname, "./build")));


 */
const uri =
  "mongodb+srv://parth1499:parth1499@cluster0.prgtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log(
    "********************\nMongoDB database connection established successfully.\n********************"
  );
  app.listen(port, async () => {
    console.log(`Server running on port: ${port}`);

    // comment for normal run and for deployment uncomment
    /* await open(`${host}`); */
  });
});
const orderRouter = require("./routes/orderRoutes");
const customerRouter = require("./routes/customerRoutes");
const partRouter = require("./routes/partRoutes");
const linkRouter = require("./routes/linkRoutes");

app.use("/orders", orderRouter);
app.use("/customers", customerRouter);
app.use("/parts", partRouter);
app.use("/link", linkRouter);

// comment for normal run and for deployment uncommnet
/* app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
}); */
