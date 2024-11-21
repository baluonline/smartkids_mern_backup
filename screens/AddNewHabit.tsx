import { FC, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  TextInput,
  Card,
  PaperProvider,
  Text,
  Title,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "@/constants/Colors";
import { Habit } from "@/model/Habit";
import { AppDispatch, RootState } from "@/store/redux/store";
import { addNewHabit } from "@/store/actions/userSlices";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    borderColor: Colors.red500,
    borderWidth: 2,
    backgroundColor: "white",
    padding: 4,
    margin: 5,
    alignContent: "center",
    flexGrow: 1,
    borderRadius: 20,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
  },
  inputFields: {
    flex: 1,
    margin: 10,
    width: 200,
  },
  cardActions: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
  },
  cardTitle: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 700,
  },
});

export const AddNewHabit = (): JSX.Element => {
  const [habitName, setHabitName] = useState("");
  const [visible, setVisible] = useState(false);
  const [minPoints, setMinPoints] = useState("");
  const [maxPoints, setMaxPoints] = useState("");
  const [addHabitText, setAddHabitText] = useState("");
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const dispatch: AppDispatch = useDispatch();
  const habitLoading: boolean = useSelector((state: RootState) => {
    return state.kids.habitLoading || false;
  });
  const handleMaxPoints = (text: string) => {
    console.log(/^\d*$/.test(text));
    if (/^\d*$/.test(text)) {
      setMaxPoints(text);
    }
  };
  const handleMinPoints = (text: string) => {
    if (/^\d*$/.test(text)) {
      setMinPoints(text);
    }
  };
  const AddNewHabit = () => {
    // Generate a random number and convert it to base 36 (alphanumeric)
    const randomNumber = Math.random().toString(36).substring(2);
    // Get the current timestamp in milliseconds
    const timestamp = new Date().getTime();
    const uniqueId = `${timestamp}-${randomNumber}`;

    const habit = new Habit(
      uniqueId,
      habitName,
      parseInt(minPoints),
      parseInt(maxPoints)
    );
    // console.log("habit " + JSON.stringify(habit));
    dispatch(addNewHabit(habit));
  };
  const cancel = () => {
    setHabitName("");
    setMaxPoints("");
  };
  interface dialogProps {
    addHabitText: string;
  }
  const AlertDialog: React.FC = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{addHabitText}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.cardActions}>
          <ScrollView style={styles.scrollViewContainer}>
            <View style={styles.cardContainer}>
              <Title style={styles.title}>New Habit Form </Title>
              <TextInput
                style={styles.inputFields}
                label="Habit name"
                value={habitName}
                onChangeText={(text) => setHabitName(text)}
              />
              <TextInput
                label="Habit Min points"
                value={minPoints}
                onChangeText={handleMinPoints}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="Enter min points"
                style={[styles.inputFields]}
              />
              <TextInput
                label="Habit Max points"
                value={maxPoints}
                onChangeText={handleMaxPoints}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="Enter max points"
                style={[styles.inputFields]}
              />
            </View>
            <Card.Actions>
              <ActivityIndicator
                animating={habitLoading}
                color={Colors.primary100}
                size="large"
              />
              <Button
                onPress={cancel}
                buttonColor={Colors.red500}
                textColor={Colors.primary50}
              >
                Cancel
              </Button>
              <Button onPress={AddNewHabit}>Submitt</Button>
            </Card.Actions>
          </ScrollView>
        </Card>
      </View>
    </PaperProvider>
  );
};
