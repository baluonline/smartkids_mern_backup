// reducers.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from '../actions/actionTypes';
import { fetchKids, addNewKid, addNewHabit, fetchHabits, updateKidData } from '../actions/userSlices';
import { Kid } from '@/model/Kid';


interface Habit {
  _id: string,
  habitName: string,
  minPoints: number,
  maxPoints: number,
  currentPoints: number
}

interface usersState {
  kids: Kid[];
  habits: Habit[];
  loading: boolean;
  error: string | null;
  selectedKidId: string;
  selectedKid: Kid | null;
  addNewKidError: string;
  habitLoading: boolean;
  loadingHabits: boolean;
  kidInfoSaving: boolean;

}


const initialState: usersState = {
  loading: false,
  loadingHabits: true,
  kids: [],
  error: '',
  selectedKidId: '',
  selectedKid: null,
  addNewKidError: '',
  habits: [],
  habitLoading: true,
  kidInfoSaving: false,

};


const kidsSlice = createSlice({
  name: 'kids',
  initialState,
  reducers: {
    selectedKid(state, action: PayloadAction<Kid>) {
      state.selectedKidId = action.payload?._id || '';
      state.selectedKid = action.payload || null;
    },
    clearSelectedKid(state) {
      state.selectedKidId = '';
      state.selectedKid = null;
    },
    setHabits(state, action) {
      state.habits = action.payload;
    },
    setHabitLoading(state, action) {
      state.habitLoading = action.payload;
    },
    setkidInfoSaving(state, action) {
      state.kidInfoSaving = action.payload;
    },

    updateHabitPoints(state, action) {
      const { habitName, currentPoints, minPoints, maxPoints, operation } = action.payload;
      const habit = state.habits.find((h: Habit) => h.habitName === habitName);
      console.log(JSON.stringify(habit))
      if (habit) {
        if (!(habit?.currentPoints)) {
          habit.currentPoints = 0;
        }
        operation === 'plus' ? habit.currentPoints++ : habit.currentPoints--;
      } else {
        console.log('habit is not existed')
      }

      // console.log(state.habits)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKids.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKids.fulfilled, (state, action: PayloadAction<Kid[]>) => {
        console.log('action payload size', (action.payload.length));
        state.loading = false;
        if (action.payload.length > 0) {
          state.kids = [...action.payload];
        } else state.kids = [];

      })
      .addCase(fetchKids.rejected, (state, action) => {
        console.log('fetchKids reducer rejected');
        state.loading = false;
        state.error = action?.error.message || 'Something went wrong';
      })

      .addCase(addNewKid.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewKid.fulfilled, (state, action: PayloadAction<Kid[]>) => {
        state.loading = false;
        if (action.payload.length > 0) {
          state.kids = [...action.payload];
        } else state.kids = [];

      })
      .addCase(addNewKid.rejected, (state, action) => {
        console.log('addNewKid reducer rejected ' + JSON.stringify(action.payload));
        state.loading = false;
        state.addNewKidError = `Could not add kid with error : ${JSON.stringify(action.payload) || ''}`;
      })
      //NEW HABIT
      .addCase(addNewHabit.pending, (state: any) => {
        state.habitLoading = true;
      })
      .addCase(addNewHabit.fulfilled, (state: any, action: PayloadAction<Habit[]>) => {
        state.habitLoading = false;
        if (action.payload.length > 0) {
          state.habit = [...action.payload];
        } else state.habit = null;

      })
      .addCase(addNewHabit.rejected, (state, action) => {
        console.log('addNewHabit reducer rejected ' + JSON.stringify(action.payload));
        state.habitLoading = false;
        state.addNewKidError = `Could not add habit with error : ${JSON.stringify(action.payload) || ''}`;
      })

      // fetch habit
      .addCase(fetchHabits.pending, (state: any) => {
        state.habitLoading = true;
      })
      .addCase(fetchHabits.fulfilled, (state: any, action: PayloadAction<Habit[]>) => {
        state.habitLoading = false;

        if (action.payload.length > 0) {
          state.habits = [...action.payload];
        } else state.habits = null;

      })
      .addCase(fetchHabits.rejected, (state, action) => {
        console.log('fetch habit reducer rejected ' + JSON.stringify(action.payload));
        state.habitLoading = false;
        state.addNewKidError = `Could not fetch habits with error : ${JSON.stringify(action.payload) || ''}`;
      })

      //update kids data
      .addCase(updateKidData.pending, (state: usersState) => {
        state.kidInfoSaving = true;
      })
      .addCase(updateKidData.fulfilled, (state: usersState, action: PayloadAction<Kid | null>) => {
        state.kidInfoSaving = false;

        state.selectedKid = action.payload
          ? action.payload
          : null;
      })
      .addCase(updateKidData.rejected, (state: usersState, action: PayloadAction<any>) => {
        console.error(
          `Update Kid data reducer rejected: ${JSON.stringify(action.payload)}`
        );
        state.habitLoading = false;
        state.addNewKidError = `Could not update kid's information. Error: ${JSON.stringify(action.payload) || ''}`;
      });

  },

})

// export const { todoAdded } = usersSlice.actions
export const { selectedKid, clearSelectedKid, setHabits, updateHabitPoints, setHabitLoading } = kidsSlice.actions;
export default kidsSlice.reducer


