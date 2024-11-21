import { Habit } from "@/model/Habit";
import { Kid } from "@/model/Kid";

export const computeHabits = (selectedKid: Kid | undefined, habitsLocal: Habit[]): Habit[] => {
    const selectedKidHabits = selectedKid?.habits || [];

    const updatedHabits = [...selectedKidHabits];

    habitsLocal.forEach((localHabit) => {
        const existingHabit = updatedHabits.find((habit) => habit._id === localHabit._id);

        if (!existingHabit) {
            // Add new habit if it doesn't exist
            updatedHabits.push({
                _id: localHabit._id,
                habitName: localHabit.habitName,
                minPoints: localHabit.minPoints,
                maxPoints: localHabit.maxPoints,
                currentPoints: 0, // Default to 0
            });
        } else if (existingHabit.currentPoints === undefined) {
            // Ensure `currentPoints` is set
            existingHabit.currentPoints = 0;
        }
    });

    return updatedHabits;
};
