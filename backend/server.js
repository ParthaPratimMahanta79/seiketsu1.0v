require("dotenv").config();

const app = require("./src/app");


// connect to database
const connectDB = require("./src/config/db");
connectDB();


// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

