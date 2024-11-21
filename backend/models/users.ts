import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    fullName: string;
    age: number;
    sex: string;
    zipcode: number,
    habits: [{
        habitName: { type: String },
        currentPoints: { type: Number },
        minPoints: { type: Number },
        maxPoints: { type: Number },
    }]
}

const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: false
    },
    favoriteFood: {
        type: String,
        required: false
    },
    habits: [{
        habitName: { type: String },
        currentPoints: { type: Number },
        minPoints: { type: Number },
        maxPoints: { type: Number },
    }]

});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
