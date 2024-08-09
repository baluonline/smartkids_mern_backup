import { zip } from "lodash";
import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import User from "../models/users"

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    const currentPage = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const perPage = 10;
    let totalItems: number;
    console.log('getUsers')
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        (error as any).statusCode = 422;
        throw error;
    }

    const { fullName, email, age, gender, zipcode } = req.body;

    const user = new User({
        fullName,
        email,
        gender,
        age,
        zipcode,
    });

    console.log('users post ', JSON.stringify(user))
    user
        .save()
        .then((result) => {
            return User.findById(result.id);
        })
        .then((user) => {
            if (user) {
                // user.products.push(user);
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
            if (!err.statusCode) {
                err.statusCode = 500;
            }
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