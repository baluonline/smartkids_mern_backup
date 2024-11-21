import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { Dashboard } from "../../screens/Dashboard";
import { AddNewKids } from "@/screens/AddNewKid";
import { AddNewHabit } from "@/screens/AddNewHabit";
import { NavRoutes } from "@/constants/NavigationRoutes";
import { Colors } from "@/constants/Colors"; // Assuming you have Colors defined

const Tab = createBottomTabNavigator();

export const BottomTabs = (): JSX.Element => {
  return (
    <Tab.Navigator
      initialRouteName={NavRoutes.NAV_DASHBOARD}
      screenOptions={{ tabBarActiveTintColor: Colors.red500 }}
    >
      <Tab.Screen
        name={NavRoutes.NAV_DASHBOARD}
        component={Dashboard}
        options={{
          tabBarLabel: "Parent Board",
          headerTitle: "Parent Board",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={NavRoutes.ADD_NEWKID}
        component={AddNewKids}
        options={{
          tabBarLabel: "Kid's Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={NavRoutes.ADD_NEW_HABIT}
        component={AddNewHabit}
        options={{
          tabBarLabel: "Habits",
          headerTitle: "Add New Habit",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hiking" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
