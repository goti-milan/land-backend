const express = require("express");
require("dotenv").config({ path: "./local.env" });
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorController");
const authRoutes = require("./routes/authRoutes");
const translationStoryRoutes = require("./routes/translationStoryRoutes");
const itemRoutes = require("./routes/itemRoutes");
const languageRoutes = require("./routes/languageRoutes");
const masterStoriesRoute = require("./routes/masterStoriesRoute");
const sentenceRoutes = require("./routes/sentenceRoutes");
const mobileRoute = require("./routes/mobileRoute/index");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger");
const templateRoute = require("./routes/templateRoutes");
var path = require("path");
const localizifyMobileAPI = require("./middlewares/localizifyMobileAPI");

const app = express();

const PORT = process.env.PORT || 80;

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION. Shutting down...");
  server.close(() => process.exit(1));
});

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(
  db,
  () => {
    console.log("Connected");
  },
  (err) => console.log(err.message)
);

const origin =
  process.env.NODE_ENV === "production"
    ? "https://minr-admin-frontend.herokuapp.com"
    : process.env.FRONTEND_PORT;

console.log("" + origin);

app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// dashboard

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/stories", translationStoryRoutes);
app.use("/api/v1/sentences", sentenceRoutes);
app.use("/api/v1/languages", languageRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/template", templateRoute);
app.use("/api/v1/master-stories", masterStoriesRoute);

//mobile APIs
app.use("/api/v1/mobile", localizifyMobileAPI, mobileRoute);

//swagger

app.use("/api/v1/mobile", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} is not defined!`, 404));
});

app.use(errorController);

// heroku
app.set("trust proxy", 1);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
