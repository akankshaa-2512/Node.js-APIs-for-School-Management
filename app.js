const express = require("express");
const app = express();
const dotenv = require("dotenv");
const schoolRoutes = require("./routes/schoolRoutes");

dotenv.config();
app.use(express.json());

app.use("/", schoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
