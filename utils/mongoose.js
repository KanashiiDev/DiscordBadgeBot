const mongoose = require("mongoose");
const { MONGO } = require("../config.json");
mongoose.set("strictQuery", false);
mongoose.connect(MONGO, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});

mongoose.connection.on("error", () => {
  console.error("MongoDB connection failed!");
});