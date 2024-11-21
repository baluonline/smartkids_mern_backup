import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  PressableProps,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
Colors;

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  textStyle?: TextStyle;
}

function CustomButton({ onPress, children, style, textStyle }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressableButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  pressableButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    backgroundColor: Colors.red500,
    elevation: 2,
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.primary50,
  },
});
