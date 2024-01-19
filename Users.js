const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
      {
            nama: String,
            email: { type: String, unique: true },
            npm: String,
            password: String
      },
      {
            collection: "Users"
      }
);

mongoose.model("Users", UserSchema);


const TugasSchema = new mongoose.Schema(
      {
        kegiatan: String,
        jam: String,
      },
      {
        collection: "Schedules",
      }
    );

mongoose.model("Schedules", TugasSchema);