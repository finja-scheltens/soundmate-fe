import * as React from "react";
import { Defs, LinearGradient, Stop } from "react-native-svg";

import {
  VictoryChart,
  VictoryArea,
  VictoryTheme,
  VictoryPolarAxis,
} from "victory-native";

import { AppColors } from "../constants/AppColors";

export default function MatchRadarChart() {
  return (
    // TODO: set maximum for domain ?
    <VictoryChart
      polar
      theme={VictoryTheme.material}
      domain={{ y: [0, 1] }}
      startAngle={70}
      endAngle={430}
      height={320}
    >
      <VictoryPolarAxis
        labelPlacement="vertical"
        style={{
          axis: { stroke: "#E0E0E0" },
          grid: { stroke: "#E0E0E0" },
          tickLabels: { fontSize: 14, padding: 15 },
        }}
      />
      <Defs>
        <LinearGradient id="gradient1">
          <Stop offset="0%" stopColor={AppColors.PRIMARY} />
          <Stop offset="80%" stopColor="#e32110" />
        </LinearGradient>
      </Defs>
      <Defs>
        <LinearGradient id="gradient2">
          <Stop offset="0%" stopColor={AppColors.SECONDARY} />
          <Stop offset="100%" stopColor="#0a33a3" />
        </LinearGradient>
      </Defs>
      <VictoryArea
        interpolation="catmullRom"
        data={[
          { x: "Novel", y: 1 },
          { x: "Divers", y: 1 },
          { x: "Mainstream", y: 0.4 },
        ]}
        style={{
          data: {
            fill: "url(#gradient1)",
            fillOpacity: 0.8,
            strokeWidth: 1,
          },
        }}
        animate={{
          duration: 500,
          onLoad: { duration: 500 },
          easing: "linear",
        }}
      />
      <VictoryArea
        interpolation="catmullRom"
        data={[
          { x: "Novel", y: 1 },
          { x: "Divers", y: 0.5 },
          { x: "Mainstream", y: 0.9 },
        ]}
        style={{
          data: {
            fill: "url(#gradient2)",
            fillOpacity: 0.6,
            strokeWidth: 1,
          },
        }}
        animate={{
          duration: 500,
          onLoad: { duration: 500 },
          easing: "linear",
        }}
      />
    </VictoryChart>
  );
}
