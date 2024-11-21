import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

const feedRoutes = require('./routes/usersFeed');
import User from "./models/users";
import Habit from './models/Habit';

const app = express();
const port = process.env.PORT || 3000;

// 1. Global Middleware

// CORS configuration
app.use(cors({
    origin: 'http://192.168.1.6:8080',  // No trailing slash here
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Customize the headers if needed
}));

app.use(express.json());  // Parses incoming requests with JSON payloads

// 2. Routes
app.use('/kids', feedRoutes);  // Mount the router on /kids

// Get kids 
app.get('/smart/kids', (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const perPage = 10;

    console.log('get kids');
    User.find()
        .countDocuments()
        .then((count) => {
            return User.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then((users: any) => {
            res.status(200).json({
                success: true,
                message: "Fetched Users successfully.",
                users: users,
            });
        })
        .catch((err: any) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            err.success = false;
            next(err);
        });
});

//Add new kid
app.post(
    "/smart/add_new_kid",
    [
        body("fullName").trim().isLength({ min: 5 }),
        body("email").trim().isLength({ min: 5 }),
    ],
    (req: Request, res: Response, next: NextFunction) => {

        const { fullName, email, age, gender, zipcode } = req.body;

        const user = new User({
            fullName,
            email,
            gender,
            age,
            zipcode,
        });

        user
            .save()
            .then((result) => {
                return User.findById(result.id);
            })
            .then((user) => {
                if (user) {
                    return user.save();
                }

                throw new Error("User not found");
            })
            .then((result) => {
                res.status(201).json({
                    success: true,
                    message: "User added successfully!",
                    user: result,
                });
            })
            .catch((err: any) => {
                if (err.code === 11000) {
                    console.error("Duplicate key error:", err);
                    err.statusCode = 409;
                    err.message = `Duplicate key error: A user with this email(${err?.keyValue?.email}) already exists.`;
                } else if (!err.statusCode) {
                    console.error("Unknown server error:", err);
                    err.statusCode = 500;
                    err.message = "An internal server error occurred.";
                    err.user = user;
                }

                next(err);  // Pass the error to the error-handling middleware
            });
    }
);

//update kid details
app.put(
    "/smart/update_kid",
    [
        body("fullName").trim().isLength({ min: 5 }),
        body("email").trim().isLength({ min: 5 }),
    ],
    (req: Request, res: Response, next: NextFunction) => {
        const { fullName, email, age, gender, zipcode, _id, habits } = req.body;
        // console.log(habits);

        User.findByIdAndUpdate(
            _id,  // Find user by id
            { $set: { fullName, email, gender, age, zipcode, habits } },  // Update details
            { new: true }
        )
            .then((response) => {
                if (response) {
                    res.status(200).json({
                        success: true,
                        message: "User updated successfully!",
                        user: response,
                    });
                } else {
                    throw new Error("User not found");
                }
            })
            .catch((err: any) => {
                if (err.code === 11000) {
                    console.error("Duplicate key error:", err);
                    err.statusCode = 409;
                    err.message = `Duplicate key error: A user with this email (${err?.keyValue?.email}) already exists.`;
                } else if (!err.statusCode) {
                    console.error("Unknown server error:", err);
                    err.statusCode = 500;
                    err.message = "An internal server error occurred.";
                }
                next(err);  // Pass the error to the error-handling middleware
            });
    }
);


// / Fetch all habits
app.get('/smart/habits', (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const perPage = 10;

    // console.log('Fetching habits...');

    let totalHabits: number;

    // First, count total habits for pagination
    Habit.countDocuments()
        .then(count => {
            totalHabits = count;
            // console.log('count ' + Habit)
            // Fetch the habits with pagination
            return Habit.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(habits => {
            // console.log('Habits fetched: ', habits);
            // Respond with habits and additional pagination info
            res.status(200).json({
                success: true,
                message: "Fetched habits successfully.",
                habits: habits,
                totalItems: totalHabits,
                currentPage: currentPage,
                totalPages: Math.ceil(totalHabits / perPage),
                perPage: perPage
            });
        })
        .catch(err => {
            console.error('Error fetching habits:', err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            err.success = false;
            next(err);
        });
});


//Add new Habit
app.post(
    "/smart/add_new_habit",
    [
        body("habitName").trim().isLength({ min: 3 }),
    ],
    (req: Request, res: Response, next: NextFunction) => {

        const { habitName, minPoints, maxPoints } = req.body;

        const habitData = new Habit({
            habitName,
            minPoints,
            maxPoints,
        });

        habitData
            .save()
            .then((result: any) => {
                return Habit.findById(result.id);
            })
            .then((habit: any) => {
                if (habit) {
                    return habit.save();
                }

                throw new Error("Habit not found");
            })
            .then((result: any) => {
                res.status(201).json({
                    success: true,
                    message: "Habit added successfully!",
                    habit: result,
                });
            })
            .catch((err: any) => {
                if (err.code === 11000) {
                    console.error("Duplicate key error:", err);
                    err.statusCode = 409;
                    err.message = `Duplicate key error: A Habit with this name(${err}) already exists.`;
                } else if (!err.statusCode) {
                    console.error("Unknown server error:", err);
                    err.statusCode = 500;
                    err.message = "An internal server error occurred.";
                    err.habit = habitData;
                }

                next(err);  // Pass the error to the error-handling middleware
            });
    }
);

// 3. Catch-all 404 route (for undefined routes)
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Route not found');
});

// 4. Global Error Handler (handles all errors)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(err.statusCode || 500).send({
        message: err.message,
        status: false
    });
});

// Start the server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

mongoose.connect(
    "mongodb+srv://newuser:Mani5naidu@cluster0.bykdf.mongodb.net/smartPeople?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(4000, () => {
            console.log(`Server is running on port 4000`);
        });
    })
    .catch((err) => console.log(err));
