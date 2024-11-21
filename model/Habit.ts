export class Habit {
    _id: string;
    habitName: string;
    currentPoints: number;
    minPoints: number;
    maxPoints: number;

    constructor(
        _id: string,
        habitName: string,
        currentPoints: number,
        minPoints: number,
        maxPoints: number,
    ) {
        this._id = _id;
        this.habitName = habitName;
        this.minPoints = minPoints;
        this.maxPoints = maxPoints;
        this.currentPoints = currentPoints;
    }

    /*    // Method to update current points
       updatePoints(points: number): void {
           const newPoints = this.currentPoints + points;
           if (newPoints >= this.minPoints && newPoints <= this.maxPoints) {
               this.currentPoints = newPoints;
           } else {
               console.warn(`Points must be between ${this.minPoints} and ${this.maxPoints}`);
           }
       } */
}
