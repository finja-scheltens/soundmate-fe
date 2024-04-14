import * as React from "react";
import { Defs, LinearGradient, Stop } from "react-native-svg";

import {
  VictoryChart,
  VictoryArea,
  VictoryTheme,
  VictoryPolarAxis,
} from "victory-native";

import { AppColors } from "../../constants/AppColors";

type RadarChartProps = {
  userFactors: {
    novelFactor: number;
    mainstreamFactor: number;
    diverseFactor: number;
  };
  matchFactors: {
    novelFactor: number;
    mainstreamFactor: number;
    diverseFactor: number;
  };
};

export default function MatchRadarChart({
  userFactors,
  matchFactors,
}: RadarChartProps) {
  const allFactors = [
    userFactors.novelFactor,
    userFactors.mainstreamFactor,
    userFactors.diverseFactor,
    matchFactors.novelFactor,
    matchFactors.mainstreamFactor,
    matchFactors.diverseFactor,
  ];

  const maxFactor = Math.max(...allFactors);

  return (
    <VictoryChart
      polar
      theme={VictoryTheme.material}
      maxDomain={{ y: maxFactor }}
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
          { x: "Novel", y: userFactors.novelFactor },
          { x: "Divers", y: userFactors.diverseFactor },
          { x: "Mainstream", y: userFactors.mainstreamFactor },
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
          { x: "Novel", y: matchFactors.novelFactor },
          { x: "Divers", y: matchFactors.diverseFactor },
          { x: "Mainstream", y: matchFactors.mainstreamFactor },
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
