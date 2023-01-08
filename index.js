const express = require("express"),
  morgan = require("morgan"),
  multer = require("multer"),
  path = require("path"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  fs = require("fs"),
  fsextra = require("fs-extra");

const app = new express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("./images"));

// Database
mongoose.connect(
  "mongodb+srv://fazliddin:935722706@cluster0.qbvfunu.mongodb.net/?retryWrites=true&w=majority"
);

const imageSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    require: true,
  },
});

const Image = mongoose.model("Image", imageSchema);

//Controllers

const storage = multer.diskStorage({
  destination: __dirname + "\\images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("avatar"), async (req, res) => {
  try {
    const newImage = await Image.create({ imgUrl: req.file.filename });
    res.status(200).json({
      status: "succes",
      data: { images: newImage },
    });
  } catch (error) {
    res.status(404).send("failed");
  }
});

app.get("/upload", async (req, res) => {
  const images = await Image.find();
  res.status(200).json({ status: "success", data: { images } });
});

app.delete("/upload/:id", async (req, res) => {
  fs.unlink("./images");
  const images = await Image.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ status: "success", data: { images } });
});

app.delete("/upload", async (req, res) => {
  const images = await Image.remove();
  fsextra.emptyDirSync(__dirname + "\\images");
  res.status(200).json({ status: "success", images });
});

const PORT = 3000;
app.listen(PORT, "", () => {
  console.log("Server is running in " + PORT);
});
