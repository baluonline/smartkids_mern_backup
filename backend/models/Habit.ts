import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
    habitName: string;
    minPoints: number;
    maxPoints: number;
}

const habitSchema: Schema<IHabit> = new Schema({
    habitName: {
        type: String,
        required: true
    },
    minPoints: {
        type: Number,
        required: true,
        validate: {
            validator: function (this: IHabit, value: number) {
                // Ensure minPoints <= maxPoints
                return value <= this.maxPoints;
            },
            message: "minPoints should be less than or equal to maxPoints"
        }
    },
    maxPoints: {
        type: Number,
        required: true
    },
},
    {
        // Enable timestamps for createdAt and updatedAt fields
        timestamps: true,
        collection: "habits"  // Specify the collection name explicitly
    });

// Create and export the Habit model
const Habit = mongoose.model<IHabit>("Habit", habitSchema);

export default Habit;
