import { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  TextInput,
  HelperText,
  RadioButton,
  Text,
  PaperProvider,
} from "react-native-paper";
import { AppDispatch, RootState } from "@/store/redux/store";
import { Kid } from "@/model/Kid";
import { addNewKid } from "@/store/actions/userSlices";
import { Colors } from "@/constants/Colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    backgroundColor: Colors.light.background,
    padding: 4,
    marginLeft: 5,
    alignContent: "center",
    flex: 1,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    height: 40,
    margin: 12,
  },
  fullName: {
    width: "80%",
  },
  age: {
    marginTop: 10,
    padding: 4,
    width: 100,
  },
  genderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    marginVertical: 10,
    marginLeft: 15,
  },
  genderRadio: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  zipcode: {
    marginTop: 10,
    padding: 4,
    width: "80%",
  },
  emailAddress: {
    marginTop: 10,
    padding: 4,
    width: "80%",
  },
  favoriteFood: {
    marginTop: 10,
    padding: 4,
    width: "80%",
  },
  registerBtnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  registerBtn: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    margin: 15,
    borderRadius: 10,
  },
  addNewKidError: {
    fontSize: 15,
    fontWeight: "500",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
  },
});

export const AddNewKids = (): JSX.Element => {
  const [kidName, setKidName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("boy");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [favoriteFood, setFavoriteFood] = useState("");

  const addNewKidError = useSelector(
    (state: RootState) => state.kids.addNewKidError
  );
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();

  const validateEmail = (email: string) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        // This cleanup runs when the screen loses focus (i.e., when switching tabs)
        setKidName("");
        setAge("");
        setGender("boy");
        setEmail("");
        setEmailError(false);
        setZipcode("");
        setFavoriteFood("");
        console.log("Form reset on tab switch.");
      };
    }, [])
  );

  const onSubmit = async () => {
    const isValidEmail = validateEmail(email);
    setEmailError(!isValidEmail);
    if (!isValidEmail) {
      return;
    }

    // Generate unique ID
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    const kid = new Kid(
      uniqueId,
      kidName,
      email,
      parseInt(age),
      gender,
      parseInt(zipcode),
      favoriteFood,
      []
    );

    dispatch(addNewKid(kid));
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.container}>
          <TextInput
            style={[styles.fullName, styles.input]}
            placeholder="First Name, Last Name"
            value={kidName}
            onChangeText={setKidName}
          />
          <TextInput
            style={[styles.emailAddress, styles.input]}
            placeholder="Parent's Email Address"
            value={email}
            onChangeText={setEmail}
          />
          {emailError && (
            <HelperText type="error" visible={true}>
              Invalid email, please enter a correct email.
            </HelperText>
          )}
          <TextInput
            style={[styles.age, styles.input]}
            placeholder="Age"
            value={age}
            keyboardType="numeric"
            maxLength={2}
            onChangeText={setAge}
          />
          <View style={styles.genderContainer}>
            <Text>Select Gender:</Text>
            <RadioButton.Group onValueChange={setGender} value={gender}>
              <View style={styles.genderRadio}>
                <RadioButton value="boy" />
                <Text onPress={() => setGender("boy")}>Boy</Text>
              </View>
              <View style={styles.genderRadio}>
                <RadioButton value="girl" />
                <Text onPress={() => setGender("girl")}>Girl</Text>
              </View>
            </RadioButton.Group>
          </View>
          <TextInput
            style={[styles.zipcode, styles.input]}
            placeholder="Enter Your Zipcode"
            keyboardType="numeric"
            value={zipcode}
            maxLength={5}
            onChangeText={setZipcode}
          />
          <TextInput
            style={[styles.favoriteFood, styles.input]}
            placeholder="Your kid's favorite food"
            value={favoriteFood}
            onChangeText={setFavoriteFood}
          />
          <View style={styles.registerBtnContainer}>
            <Button
              mode="contained"
              onPress={onSubmit}
              style={styles.registerBtn}
            >
              Register
            </Button>
          </View>
          {addNewKidError && (
            <HelperText
              style={styles.addNewKidError}
              type="error"
              visible={true}
            >
              {addNewKidError}
            </HelperText>
          )}
        </View>
      </ScrollView>
    </PaperProvider>
  );
};
