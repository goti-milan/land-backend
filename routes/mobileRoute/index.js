const express = require("express");
const authRoutes = require("./authRoutes");
const storyRoutes = require("./storyRoutes");

const routes = express.Router();

routes.use("/auth", authRoutes);

routes.use("/stories", storyRoutes);

module.exports = routes;
