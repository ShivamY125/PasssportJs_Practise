const mongoose = require("mongoose");
 const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://passport:connectpassport@passport.dnvkr.mongodb.net/?retryWrites=true&w=majority&appName=passport"
    );
    console.log("Db is connected on the address");
  } catch (err) {
    console.log(`Error connecting to DB ${err}`);
  }
};

module.exports = dbConnect;


