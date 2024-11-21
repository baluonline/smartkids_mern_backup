const express: any = require("express");
// const { body } = require("express-validator/check");
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
// import * as feedController from '../controllers/feed';
const feedController = require("../controllers/feed");
// const isAuth = require("..//middleware/is-auth");
const router = express.Router();

// GET /feed/products
// router.get("/users", feedController.getUsers);
router.get("/users", (req: Request, res: Response) => {
    
    res.send('Hello World!');
});

// POST /feed/people
router.post(
    "/user",
    [
        body("fullName").trim().isLength({ min: 5 }),
        body("email").trim().isLength({ min: 5 }),
    ],
    feedController.addUser
);


//DELETE /feed/deleteproduct/{id}
router.delete(
    "/user/:userId",
    // isAuth,
    feedController.deleteUser
);
// router.get("/post/:postId", isAuth, feedController.getPost);

// router.put(
//   "/post/:postId",
//   isAuth,
//   [
//     body("title").trim().isLength({ min: 5 }),
//     body("content").trim().isLength({ min: 5 }),
//   ],
//   feedController.updatePost
// );

// router.delete("/post/:postId", isAuth, feedController.deletePost);
module.exports = router;