import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";
import {register} from "./controllers/auth.js";



//Configuration
const __filename = fileURLToPath(import.meta.url);

/*
    const __filename = fileURLToPath(import.meta.url);:

    import.meta.url is a special variable available in ECMAScript modules (files with "type": "module"), and it contains the URL of the current module.

    fileURLToPath is a function from the url module that converts a file URL to a file path.

*/

const __dirname = path.dirname(__filename);

/*

    const __dirname = path.dirname(__filename);:

    path.dirname is a method from the path module that returns the directory name of a path.
    __dirname is a variable that is being assigned the directory name of the current module, extracted from __filename.

    After these statements, __filename holds the absolute file path of the current module, and __dirname holds the absolute directory path of the current module.

*/

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("comman"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

// File Storage

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
});

const upload = multer({storage});

// Routes With Files
app.post("/auth/register",upload.single("picture"),register)

// Mongoose SetUp
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
