import path from "path";
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
const cors = require('cors');
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
const feedRoutes = require('./routes/usersFeed');

const app = express();
const port = process.env.PORT || 8080;

// Use CORS middleware
app.use(cors());
app.use(cors({
    origin: 'http://localhost:8080' // Replace with your frontend URL if necessary
}));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4());
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/kids", feedRoutes);
app.get('/kids-test/users-check', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const successStatus = error ? false : true;
    const data = error.data;
    res.status(status).json({ message, data, success: successStatus });
});

mongoose
    .connect(
        "mongodb+srv://newuser:Mani5naidu@cluster0.bykdf.mongodb.net/smartPeople?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => console.log(err));
