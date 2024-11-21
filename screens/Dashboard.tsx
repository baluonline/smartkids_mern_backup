import { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Alert, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, Text, Title } from "react-native-paper";

import { NavRoutes, RootStackParamList } from "@/constants/NavigationRoutes";
import { StackNavigationProp } from "@react-navigation/stack";

import { AppDispatch, RootState } from "@/store/redux/store";
import { Colors } from "@/constants/Colors";
import KidsListComponent from "./KidsList";
import {
  useNavigation,
  NavigationProp,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { fetchKids } from "@/store/actions/userSlices";

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
    padding: 20,
    marginBottom: 10,
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    flex: 1,
  },
  fallBackText: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    fontSize: 16,
  },
  addBtn: {
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  btnContainer: {
    flexDirection: "row",
    padding: 5,
    margin: 5,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export const Dashboard = (): JSX.Element => {
  const [showKidsList, setShowKidsList] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  type AddNewKidNavigationProp = StackNavigationProp<
    RootStackParamList,
    NavRoutes.ADD_NEWKID
  >;
  const navigation = useNavigation<AddNewKidNavigationProp>();

  const kids: any = useSelector((state: RootState) => {
    return state.kids.kids || [];
  });

  useEffect(() => {
    dispatch(fetchKids());
  }, [dispatch]);

  useEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("focus", async () => {});
      return () => unsubscribe();
    }, [navigation])
  );

  const onPressAddNewKid = useCallback(async () => {
    navigation.navigate(NavRoutes.ADD_NEWKID); // Use navigation.navigate
  }, [navigation]);

  return (
    <View style={styles.dashboard}>
      {kids.length > 1 ? (
        <View style={styles.listContainer}>
          <KidsListComponent />
        </View>
      ) : (
        <Text style={styles.fallBackText}>
          No kids have been added. Please add your kids.
        </Text>
      )}

      <View style={styles.btnContainer}>
        <Button
          style={styles.addBtn}
          mode="contained-tonal"
          onPress={onPressAddNewKid}
          buttonColor={Colors.red500}
          textColor={Colors.primary50}
        >
          Add Your Kid
        </Button>
      </View>
    </View>
  );
};
