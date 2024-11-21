import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import { Kid } from '@/model/Kid';
import useFetch from "@/hooks/usFetch";
import { Habit } from '@/model/Habit';

const smartHost: string = "http://192.168.1.6:8080/smart";  // Try using localhost instead of 127.0.0.1
export const fetchKids = createAsyncThunk<Kid[], void, { rejectValue: string }>(
    "kids/fetchKids",

    async (_, { rejectWithValue }) => {
        try {
            // const { isLoading, apiData, serverError,  } = useFetch(`${smartHost}/kids`)

            console.log('Fetching kids...');
            const response = await axios.get(`${smartHost}/kids`, { timeout: 10000 });  // Increased timeout

            // Check response status
            if (response.status !== 200) {
                return rejectWithValue(`Failed to fetch kids: Status ${response.status}`);
            }

            console.log('Response:', response.data);
            return response.data?.users;  // Assuming the response contains 'users'
        } catch (error: any) {
            if (error.response) {
                // The server responded with a status other than 2xx
                console.error('Server error:', error.response.status, error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response from server:', error.request);
            } else {
                // Something happened in setting up the request that triggered the error
                console.error('Axios error:', error.message);
            }
            return rejectWithValue("Failed to fetch users.");
        }
    }
);


export const addNewKid = createAsyncThunk<Kid[], Kid, { rejectValue: string }>(
    "kids/addNewKid",
    async (kidData: Kid, { rejectWithValue }) => {
        try {

            const { fullName, email, gender, age, zipcode } = kidData;
            const data = {
                fullName,
                email: email,
                gender,
                age,
                zipcode,
            } // temp data manipulaton

            const response = await axios.post(`${smartHost}/add_new_kid`, data);
            // Check for successful response
            if (response.data.status === false) {
                return rejectWithValue("Failed to add new kid: Unexpected response status.");
            }
            return response.data.users;
        } catch (error: any) {
            console.error('Error adding new kid:', JSON.stringify(error?.response?.data?.message));
            return rejectWithValue(
                error.response?.data?.message || "Failed to add new kid. Please try again."
            );
        }
    }
);


export const updateKidData = createAsyncThunk<Kid[], Kid, { rejectValue: string }>(
    "kids/updateKidData",
    async (kidData: Kid, { rejectWithValue }) => {
        try {

            const { _id, fullName, email, gender, age, zipcode, habits } = kidData;
            const data = {
                _id,
                fullName,
                email: email,
                gender,
                age,
                zipcode,
                habits
            } // temp data manipulaton
            console.log('update_kid ' + JSON.stringify(data))
            const response = await axios.put(`${smartHost}/update_kid`, data);
            // Check for successful response
            if (response.data.status === false) {
                return rejectWithValue("Failed to update kid information: Unexpected response status.");
            }
            return response.data.user;
        } catch (error: any) {
            console.error('Error updating existing kid:', JSON.stringify(error?.response?.data?.message));
            return rejectWithValue(
                error.response?.data?.message || "Failed to update kid information. Please try again."
            );
        }
    }
);


export const addNewHabit = createAsyncThunk<Habit[], Habit, { rejectValue: string }>(
    "kids/addNewHabit",
    async (habitData: Habit, { rejectWithValue }) => {
        try {

            const { habitName, minPoints, maxPoints } = habitData;
            const data = {
                habitName, minPoints, maxPoints
            } // temp data manipulaton

            const response = await axios.post(`${smartHost}/add_new_habit`, data);
            // Check for successful response
            if (response.data.status === false) {
                return rejectWithValue("Failed to add new habit: Unexpected response status.");
            }
            console.log('addnew habit ' + JSON.stringify(response.data.habit))
            return response.data;
        } catch (error: any) {
            console.error('Error adding new habit:', JSON.stringify(error?.response?.data?.message));
            return rejectWithValue(
                error.response?.data?.message || "Failed to add new habit. Please try again."
            );
        }
    }
);

export const fetchHabits = createAsyncThunk<Habit[], void, { rejectValue: string }>(
    "kids/fetchHabits",

    async (_, { rejectWithValue }) => {
        try {
            // const { isLoading, apiData, serverError,  } = useFetch(`${smartHost}/kids`)

            // console.log('Fetching habits...');
            const response = await axios.get(`${smartHost}/habits`, { timeout: 10000 });  // Increased timeout

            // Check response status
            if (response.status !== 200) {
                return rejectWithValue(`Failed to fetch habits: Status ${response.status}`);
            }

            // console.log('Response habits', response.data?.habits);
            let data = response.data?.habits;
            data = data.map((item: any) => {
                item.currentPoints = 1
                return item
            })
            return data;  // Assuming the response contains 'users'
        } catch (error: any) {
            if (error.response) {
                // The server responded with a status other than 2xx
                console.error('Server error:', error.response.status, error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response from server:', error.request);
            } else {
                // Something happened in setting up the request that triggered the error
                console.error('Axios error:', error.message);
            }
            return rejectWithValue("Failed to fetch users.");
        }
    }
);