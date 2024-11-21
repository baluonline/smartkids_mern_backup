import { Colors } from "@/constants/Colors";
import { Habit } from "@/model/Habit";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Text } from "react-native-paper";

const HabitItem: FC<{
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
);

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
  saveButton: { margin: 10 },
  errorText: { color: Colors.red500, textAlign: "center", marginVertical: 10 },
});

export default HabitItem;
