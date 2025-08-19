// components/common/StatsCard.tsx
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles/styles";
import React from "react";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface StatsCardProps {
  stats: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const { themedColors } = useThemedStyles();

  return (
    <ThemedView style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <ThemedView
          key={index}
          style={[
            styles.statCard,
            { borderColor: themedColors.border },
          ]}
        >
          <ThemedText
            type="default"
            style={[
              styles.statNumber,
              { color: stat.color || themedColors.primary },
            ]}
          >
            {stat.value}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            {stat.label}
          </ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};
