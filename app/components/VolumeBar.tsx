import * as React from "react";
import { View } from "react-native";

interface VolumeBarProps {
  color: string;
  percent: number;
  type: "ask" | "bid";
}

const VolumeBar = (props: VolumeBarProps) => {
  const { percent, type, color } = props;
  return (
    <View
      style={{
        width: `${percent}%`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: type === "bid" ? undefined : 0,
        right: type === "bid" ? 0 : undefined,
        backgroundColor: color,
      }}
    ></View>
  );
};

export default VolumeBar;
