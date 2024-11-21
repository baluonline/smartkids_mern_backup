import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../Constants/styles";
// import Icon from 'react-native-vector-icons/Ionicons';

export default function IconButton({ name, color, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && style.pressed}
    >
      <View style={style.container}>
        {/* <Icon.Button name="plus" color="white" onPress={onPress}></Icon.Button> */}
        <Button
          style={[style.button]}
          title={name}
          color={color}
          onPress={onPress}
        ></Button>
      </View>
    </Pressable>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 5,
    margin: 8,

    borderRadius: 24,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  button: {
    width: 10,
    height: 10,
    fontSize: 35,
    fontWeight: "bold",
  },
});
