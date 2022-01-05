require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
 const multer = require("multer");
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');
 const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
// app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('fir========================',file)
    cb(null, "public/images");  
    
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  
  console.log(req)
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});



app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const multer = require("multer");
// const bodyParser = require('body-parser');
// const path = require("path");
// const cors = require("cors");
// const cookieParser = require('cookie-parser')
// const router = express.Router();

// const userRoute = require("./routes/users");
// const authRoute = require("./routes/auth");
// const postRoute = require("./routes/posts");
// const errorMiddleware = require('./middlewares/error-middleware');
// const authMiddleware = require('./middlewaree/authMiddleware')
// const roleMiddleware = require('./middlewaree/roleMiddleware')
// dotenv.config();

 
// mongoose
// .connect(
//   process.env.MONGO_URL,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log("Connected to MongoDB");
//   }
// )
// app.use("/images", express.static(path.join(__dirname, "public/images")));

// //middleware
// app.use(cors());
// app.options("*", cors());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(helmet());
// app.use(morgan("common"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("File uploded successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });

// app.use("/api/auth", authRoute);
// app.use("/api/users",authMiddleware, userRoute);
// app.use("/api/posts",authMiddleware, postRoute);

// app.listen(8800, () => {
//   console.log("Backend server is running!");
// });
