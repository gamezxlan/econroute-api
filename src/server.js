require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`EconRoute API running on https://web-production-90baa.up.railway.app:${PORT}`);
});
