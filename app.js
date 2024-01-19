const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

app.use(express.json());

const mongoUrl = "mongodb+srv://shaza1:admin1@cluster0.epuit2f.mongodb.net/?retryWrites=true&w=majority";

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl).then(() => {
      console.log("Database Terhubung")
}).catch((e) => {
      console.log(e)
});

require('./Users')

const User = mongoose.model("Users")

app.get("/", (req, res) => {
      res.send({ status: "mulai" })
})

// REGISTER
app.post('/register', async (req, res) => {
      const { nama, email, npm, password } = req.body;

      const oldUser = await User.find({ email: email });

      if (oldUser.length > 0) {
            return res.send({ data: "user sudah ada!!" })
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      try {
            await User.create({
                  nama: nama,
                  email: email,
                  npm,
                  password: encryptedPassword,
            });
            res.send({ status: 'ok', data: 'user dibuat' })
      } catch (error) {
            res.send({ status: 'error', data: error })
      }
});

//LOGIN
app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const oldUser = await User.findOne({ email: email })

      if (!oldUser) {
            return res.send({ data: "user tidak di temukan !!" })
      }

      if (await bcrypt.compare(password, oldUser.password)) {
            const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);

            if (res.status(201)) {
                  return res.send({ status: "ok", data: token })
            } else {
                  return res.send({ error: "error" })
            }
      }
})

//READ USER DATA
app.post("/userdata", async (req, res) => {
      const { token } = req.body;
      try {
            const user = jwt.verify(token, JWT_SECRET)
            const useremail = user.email
            User.findOne({ email: useremail }).then(data => {
                  return res.send({ status: "ok", data: data })
            })
      } catch (error) {
            return res.send({ error: "error" })

      }
})

// UPDATE USER PROFILE
app.post("/updateprofile", async (req, res) => {
      const { token, nama, email, npm } = req.body;

      try {
            const user = jwt.verify(token, JWT_SECRET);
            const useremail = user.email;

            const updatedUser = await User.findOneAndUpdate(
                  { email: useremail },
                  { $set: { nama, email, npm } },
                  { new: true }
            );

            if (!updatedUser) {
                  return res.status(404).send({ status: "error", data: "User not found" });
            }

            const newToken = jwt.sign({ email: useremail }, JWT_SECRET);

            return res.send({
                  status: "ok",
                  data: { token: newToken, user: updatedUser },
            });
      } catch (error) {
            return res.status(500).send({ status: "error", data: error.message });
      }
});


// CREATE TASK
app.post("/createtugas", async (req, res) => {
      const {kegiatan, jam} = req.body;

      try {
            const newTugas = await mongoose.model("Schedules").create({
                  kegiatan,
                  jam,
            });

            res.send({ status: 'ok', data: newTugas });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


// WRITE TASK
app.get("/gettuggas", async (req, res) => {
      try {
            const tugas = await mongoose.model("Schedules").find();
            res.send({ status: 'ok', data: tugas });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


// UPDATE TASK
app.post("/updatetugas", async (req, res) => {
      const { tugasId,kegiatan, jam} = req.body;

      try {
            const updatedTugas = await mongoose.model("Schedules").findOneAndUpdate(
                  { _id: tugasId },
                  { $set: {kegiatan, jam} },
                  { new: true }
            );

            if (!updatedTugas) {
                  return res.status(404).send({ status: 'error', data: 'Task not found' });
            }

            res.send({ status: 'ok', data: updatedTugas });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


// DELETE TASK
app.delete("/deletetugas/:tugasId", async (req, res) => {
      const tugasId = req.params.scheduleId;

      try {
            const deletedTugas = await mongoose.model("Schedules").findByIdAndDelete(tugasId);

            if (!deletedTugas) {
                  return res.status(404).send({ status: 'error', data: 'Task not found' });
            }

            res.send({ status: 'ok', data: deletedTugas });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
      console.log('Server Berjalan di port ${PORT}')
})