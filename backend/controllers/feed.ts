import { zip } from "lodash";
import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import User from "../models/users"
import mongoose from 'mongoose';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    const currentPage = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const perPage = 10;
    let totalItems: number;
    console.log('getUsers now')
    User.find()
        .countDocuments()
        .then((count) => {
            totalItems = count;
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
};

export const addUser = (req: Request, res: Response, next: NextFunction) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        (error as any).statusCode = 422;
        (error as any).validationErrors = errors.array(); // Capture validation errors
        return next(error);
    }

    const { fullName, email, age, gender, zipcode } = req.body;

    const user = new User({
        fullName,
        email,
        gender,
        age,
        zipcode,
    });

    user.save()
        .then((result) => {
            if (!result) {
                const error = new Error("Failed to save the user.");
                (error as any).statusCode = 500;
                throw error;
            }

            return User.findById(result.id); // Fetch the user by ID after saving
        })
        .then((user) => {
            if (!user) {
                const error = new Error("User not found after creation.");
                (error as any).statusCode = 404;
                throw error;
            }

            return user.save();
        })
        .then((result) => {
            res.status(201).json({
                success: true,
                message: "User added successfully!",
                user: result,
            });
        })
        .catch((err: any) => {
            // Handle mongoose validation errors and add a statusCode property
            if (err instanceof mongoose.Error.ValidationError) {
                err.cause = 422;  // Assign a statusCode manually
                err.message = "Validation error: " + err.message;
            } else if (err.code === 11000) {
                // Handle duplicate key error (e.g., for unique email)
                err.statusCode = 409;
                err.message = "Duplicate key error: A user with this email already exists.";
            } else if (err instanceof mongoose.Error.CastError) {
                // Handle type casting errors (e.g., invalid ObjectId)
                err.cause = 400;
                err.message = "Invalid data type: " + err.message;
            } else if (!err.statusCode) {
                err.statusCode = 500;
            }

            console.log('err next' + err)
            next(err);
        });
};
export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    User.findByIdAndDelete(userId)
        .then((user) => {
            if (!user) {
                const error = new Error("User not found.");
                (error as any).statusCode = 404;
                throw error;
            }
            // Perform additional operations if needed, like removing references from other models
            res.status(200).json({
                success: true,
                message: "User deleted successfully.",
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};