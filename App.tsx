import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";

import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

import { store } from "./store/redux/store";
import { NavRoutes, RootStackParamList } from "./constants/NavigationRoutes";
import { Colors } from "./constants/Colors";
import { BottomTabs } from "./components/UI/BottomTabs";
import { KidDetails } from "./screens/KidDetails";
import { Dashboard } from "./screens/Dashboard";
import { AddNewHabit } from "./screens/AddNewHabit";

// const Stack = createNativeStackNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    Colors,
  },
};
export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PaperProvider>
          <Stack.Navigator>
            <Stack.Screen
              name={NavRoutes.BOTTOM_TABS}
              component={BottomTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NavRoutes.KID_DETAILS}
              component={KidDetails}
              options={({ navigation }) => ({
                title: "Kid Details",
              })}
            />
            <Stack.Screen
              name={NavRoutes.ADD_NEW_HABIT}
              component={AddNewHabit}
              options={({ navigation }) => ({
                title: "Add New Habit",
                headerRight: () => (
                  <Button
                    onPress={() => navigation.navigate(NavRoutes.KID_DETAILS)}
                    title="Add New Habit"
                    color={Colors.red500}
                  />
                ),
              })}
            />
          </Stack.Navigator>
        </PaperProvider>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.red500,
  },
  headerImage: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
  },
  contentStyle: {
    backgroundColor: Colors.red500,
    justifyContent: "center",
    alignItems: "center",
  },
});
