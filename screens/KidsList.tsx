import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch } from "react-redux";

import { NavRoutes, RootStackParamList } from "../constants/NavigationRoutes";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { Kid } from "../model/Kid";
import { useSelector } from "react-redux";
import { Colors } from "..//constants/Colors";
import { selectedKid } from "../store/redux/kids";

interface ItemProps {
  kid: Kid;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
  },
  imageCover: {
    width: 300,
    height: 150,
  },
});

const Item: React.FC<ItemProps> = ({
  kid,
  onPress,
  backgroundColor,
  textColor,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Card style={{ backgroundColor }}>
      <Card.Cover
        style={styles.imageCover}
        source={{ uri: "https://picsum.photos/700" }}
      />

      <Text style={[styles.title, { color: textColor }]}>{kid.fullName}</Text>
    </Card>
  </TouchableOpacity>
);

const KidsListComponent = () => {
  // const [selectedId, setSelectedId] = useState<string>();
  const dispatch = useDispatch();

  const kids = useSelector((state: any) => {
    // console.log("kids" + state.kids.kids);
    return state.kids.kids || [];
  });

  const selectedId = useSelector((state: any) => {
    // console.log("kids" + state.kids.kids);
    return state.kids.selectedKidId || null;
  });

  type KidDetailsNavigationProp = StackNavigationProp<
    RootStackParamList,
    NavRoutes.KID_DETAILS
  >;
  const navigation = useNavigation<KidDetailsNavigationProp>();

  const onPressKids = useCallback(
    (item: Kid): void => {
      dispatch(selectedKid(item));
      navigation.navigate(NavRoutes.KID_DETAILS, { id: item._id });
    },
    [navigation]
  );

  const renderItem = ({ item }: { item: Kid }) => {
    const backgroundColor =
      item.gender === "boy" ? Colors.primary500 : Colors.pink50;
    const color = item._id === selectedId ? "white" : "black";
    return (
      <Item
        kid={item}
        onPress={() => onPressKids(item)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <Suspense>
      <View style={styles.container}>
        <FlatList
          data={kids}
          renderItem={renderItem}
          keyExtractor={(item) => {
            return item?._id.toString();
          }}
          extraData={selectedId}
        />
      </View>
    </Suspense>
  );
};

export default KidsListComponent;
