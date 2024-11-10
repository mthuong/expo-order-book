import * as React from "react";
import {
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";

interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title: string;
  onPress?: () => void;
}

const Button = (props: ButtonProps) => {
  const {
    style,
    textStyle = { color: "white", fontWeight: "bold" },
    title,
    onPress,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...{
        onPress,
        style: [
          {
            padding: 8,
            backgroundColor: "lightblue",
          },
          style,
        ],
      }}
      onPress={onPress}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
