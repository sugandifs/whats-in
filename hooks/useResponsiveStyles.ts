import { baseTheme } from "@/styles/theme";
import { useWindowDimensions } from "react-native";

export const useResponsiveStyles = () => {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isLargeScreen = width >= 1024;
  const isSmallScreen = width < 375;

  const getResponsivePadding = () => {
    if (isLargeScreen) return baseTheme.spacing.xxl;
    if (isTablet) return baseTheme.spacing.xl;
    if (isSmallScreen) return baseTheme.spacing.md;
    return baseTheme.spacing.lg;
  };

  const getResponsiveFontSize = (baseSize: number) => {
    if (isLargeScreen) return baseSize + 2;
    if (isSmallScreen) return Math.max(baseSize - 2, 10);
    return baseSize;
  };

  const getGridColumns = () => {
    if (isLargeScreen) return 4;
    if (isTablet) return 3;
    return 2;
  };

  return {
    width,
    height,
    isTablet,
    isLargeScreen,
    isSmallScreen,
    getResponsivePadding,
    getResponsiveFontSize,
    getGridColumns,
  };
};
