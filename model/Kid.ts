import { Habit } from "./Habit";

export class Kid {
  _id: string;
  fullName: any;
  email: string;
  age: number;
  gender: string;
  zipcode: number;
  habits: Habit[];

  constructor(
    _id: string,
    fullName: string,
    email: string,
    age: number,
    gender: string,
    zipcode: number,
    habits: Habit[] = []
  ) {
    this._id = _id;
    this.fullName = fullName;
    this.email = email;
    this.age = age;
    this.gender = gender;
    this.zipcode = zipcode;
    this.habits = habits
  }
}
