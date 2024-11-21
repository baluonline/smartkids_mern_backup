import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Button, Card, PaperProvider, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, RouteProp } from "@react-navigation/native";
import { normalize, schema } from "normalizr";

import { NavRoutes } from "@/constants/NavigationRoutes";
import { Colors } from "@/constants/Colors";
import { AppDispatch, RootState } from "@/store/redux/store";
import { fetchHabits, updateKidData } from "@/store/actions/userSlices";
import { computeHabits } from "@/utils/util";
import { Habit } from "@/model/Habit";
import { Kid } from "@/model/Kid";
import {
  setHabitLoading,
  setHabits,
  updateHabitPoints,
} from "@/store/redux/kids";
import _ from "lodash";
import HabitItem from "./HabitItem";

interface Props {
  habits: Habit[]; // Ensure you have the correct type for habits
  updateHabitData: (habit: Habit) => void; // Define the type for the update function
}

// Subcomponent for rendering individual habits
/* const HabitItem: FC<{
  habit: Habit;
  onUpdate: (habit: Habit, operation: "plus" | "minus") => void;
}> = ({ habit, onUpdate }) => (
  <View style={styles.habitContainer}>
    <TouchableOpacity
      style={styles.pointMinusModifier}
      onPress={() => onUpdate(habit, "minus")}
    >
      <Text style={styles.buttonText}>-</Text>
    </TouchableOpacity>
    <View style={styles.habitTitle}>
      <Text style={styles.habitName}>
        {habit.habitName}: {habit.currentPoints || 1}
      </Text>
    </View>
    <TouchableOpacity
      style={styles.pointPlusModifier}
      onPress={() => onUpdate(habit, "plus")}
    >
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  </View>
); */

export const KidDetails: FC = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useRoute<RouteProp<{ KidDetails: { id: string } }>>().params;

  // Redux state selectors
  const kids = useSelector((state: RootState) => state.kids.kids || []);
  const habits = useSelector((state: RootState) => state.kids.habits || []);
  const kidInfoSaving = useSelector(
    (state: RootState) => state.kids.kidInfoSaving || false
  );
  const loadingHabits = useSelector(
    (state: RootState) => state.kids.habitLoading
  );

  const [error, setError] = useState<string | null>(null);

  const selectedKid: Kid | undefined = kids.find((kid: Kid) => kid?._id === id);

  const computedHabits = useMemo(() => {
    if (!habits) {
      console.warn("habits is undefined");
      return []; // or return a default value
    }
    const _habits = computeHabits(selectedKid, habits);
    return _habits;
  }, [habits]);

  const fetchData = async () => {
    try {
      dispatch(setHabitLoading(true));
      await dispatch(fetchHabits());
      dispatch(setHabits(computedHabits));
    } catch {
      setError("Failed to fetch habits.");
    } finally {
      dispatch(setHabitLoading(false));
    }
  };

  useEffect(() => {
    if (selectedKid) {
      fetchData();
    }
  }, [selectedKid]);

  const saveKidData = () => {
    if (selectedKid) {
      const updatedKid: Kid = { ...selectedKid, habits };
      console.log("updatedKid " + JSON.stringify(updatedKid));
      dispatch(updateKidData(updatedKid));
    }
  };

  const updateHabitData = (habit: Habit, operation: "plus" | "minus") => {
    dispatch(
      updateHabitPoints({
        habitName: habit.habitName,
        currentPoints: habit.currentPoints || 0,
        minPoints: habit.minPoints,
        maxPoints: habit.maxPoints,
        operation,
      })
    );
    console.log(habit.currentPoints);
  };

  const renderItem: ListRenderItem<Habit> = ({ item }) => (
    <HabitItem habit={item} onUpdate={updateHabitData} />
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.saveButtonContainer}>
          <Button
            style={styles.saveButton}
            buttonColor={Colors.red500}
            textColor={Colors.primary50}
            onPress={saveKidData}
            disabled={kidInfoSaving}
          >
            Save
          </Button>
          {kidInfoSaving && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.primary200} />
            </View>
          )}
        </View>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Card.Title
              title={`${_.capitalize(selectedKid?.fullName)}'s Habit Tracker`}
              subtitle={`Gender: ${_.capitalize(selectedKid?.gender)} - Age: ${
                selectedKid?.age
              }`}
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardSubtitle}
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {loadingHabits ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.primary200} />
            </View>
          ) : (
            <FlatList
              data={habits}
              renderItem={renderItem}
              keyExtractor={(item) => item?._id.toString()}
            />
          )}
        </Card>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { padding: 16, backgroundColor: "white", flex: 1 },
  cardHeader: { padding: 10 },
  cardTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  cardSubtitle: { fontSize: 16, textAlign: "center" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  habitContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
  },
  pointMinusModifier: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary200,
  },
  pointPlusModifier: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary200,
  },
  habitTitle: { flex: 1, alignItems: "center" },
  habitName: { fontSize: 18 },
  buttonText: { fontSize: 24 },

  errorText: { color: Colors.red500, textAlign: "center", marginVertical: 10 },
  saveButton: {
    width: 150,
    left: 130,
    alignItems: "center",
  },
  saveButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.light.background,
  },
  saveButtonLoader: {
    alignItems: "center",
  },
});

export default KidDetails;
