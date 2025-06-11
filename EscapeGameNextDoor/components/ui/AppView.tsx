import React, { useState, useEffect } from "react";
import ParallaxScrollView from "../ParallaxScrollView";
import { useColorScheme, View, Image, StyleSheet, Text, Dimensions } from "react-native";
import { Box } from "@mui/material";

// Responsive breakpoints
const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const { width } = dimensions;

  const responsiveValue = <T,>(mobile: T, tablet: T, desktop: T): T => {
    if (width < breakpoints.md) return mobile;
    if (width < breakpoints.lg) return tablet;
    return desktop;
  };

  return {
    width,
    height: dimensions.height,
    isSmall: width < breakpoints.sm,
    isMedium: width >= breakpoints.sm && width < breakpoints.md,
    isLarge: width >= breakpoints.md && width < breakpoints.lg,
    isXLarge: width >= breakpoints.lg,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    responsiveValue,
    responsivePadding: () => responsiveValue(16, 24, 32),
    responsiveGap: () => responsiveValue(1, 2, 3),
  };
};

type AppViewProps = {
  children: React.ReactNode;
  fullHeight?: boolean;
  centered?: boolean;
  padding?: boolean;
  headerHeight?: "small" | "medium" | "large";
};

export default function AppView({
  children,
  fullHeight = false,
  centered = true,
  padding = true,
  headerHeight = "medium",
}: AppViewProps) {
  const responsive = useResponsive();
  const colorScheme = useColorScheme();

  // Responsive logo style
  const getLogoStyle = () => {
    const baseWidth = 290;
    const baseHeight = 178;
    let scale = 1;
    if (responsive.isMobile) {
      scale = responsive.width < 400 ? 0.6 : 0.8;
    } else if (responsive.isTablet) {
      scale = 0.9;
    }
    return {
      ...styles.reactLogo,
      width: baseWidth * scale,
      height: baseHeight * scale,
      left: responsive.isMobile ? -(baseWidth * scale * 0.1) : 0,
    };
  };

  // Responsive header height
  const getHeaderHeight = () => {
    const heights = {
      small: responsive.responsiveValue(120, 140, 160),
      medium: responsive.responsiveValue(160, 180, 200),
      large: responsive.responsiveValue(200, 240, 280),
    };
    return heights[headerHeight];
  };

  return (
    <ParallaxScrollView
    
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={getLogoStyle()}
          resizeMode="contain"
        />
      }
    >
      <View
        style={[
          styles.container,
          {
            minHeight: fullHeight ? responsive.height : undefined,
            paddingHorizontal: padding ? responsive.responsivePadding() : 0,
            paddingVertical: padding ? responsive.responsivePadding() / 2 : 0,
          },
        ]}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: centered ? "center" : "flex-start",
            justifyContent: centered && fullHeight ? "center" : "flex-start",
            width: "100%",
            maxWidth: responsive.isDesktop ? 1200 : "100%",
            gap: responsive.responsiveGap(),
            margin: responsive.isDesktop ? "0 auto" : 0,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: responsive.responsiveGap(),
              maxWidth: responsive.responsiveValue("100%", "90%", "85%"),
            }}
          >
            {children}
          </Box>
        </Box>
      </View>
    </ParallaxScrollView>
  );
}

export { useResponsive };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  reactLogo: {
    bottom: 0,
    position: "absolute",
  },
});

// ResponsiveText utility
export const ResponsiveText = ({
  children,
  variant = "body1",
  align = "left",
  ...props
}: {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "caption";
  align?: "left" | "center" | "right";
  [key: string]: any;
}) => {
  const responsive = useResponsive();

  const fontSizes = {
    h1: responsive.responsiveValue(24, 28, 32),
    h2: responsive.responsiveValue(20, 24, 28),
    h3: responsive.responsiveValue(18, 20, 24),
    h4: responsive.responsiveValue(16, 18, 20),
    h5: responsive.responsiveValue(14, 16, 18),
    h6: responsive.responsiveValue(12, 14, 16),
    body1: responsive.responsiveValue(14, 16, 16),
    body2: responsive.responsiveValue(12, 14, 14),
    caption: responsive.responsiveValue(10, 12, 12),
  };

  const fontSize = fontSizes[variant];

  return (
    <Text
      style={{
        fontSize,
        textAlign: align,
        lineHeight: fontSize * 1.4,
        ...(props.style || {}),
      }}
      {...props}
    >
      {children}
    </Text>
  );
};

// Responsive spacing utility
export const ResponsiveSpacing = {
  xs: (responsive: ReturnType<typeof useResponsive>) => responsive.responsiveValue(4, 6, 8),
  sm: (responsive: ReturnType<typeof useResponsive>) => responsive.responsiveValue(8, 12, 16),
  md: (responsive: ReturnType<typeof useResponsive>) => responsive.responsiveValue(16, 20, 24),
  lg: (responsive: ReturnType<typeof useResponsive>) => responsive.responsiveValue(24, 32, 40),
  xl: (responsive: ReturnType<typeof useResponsive>) => responsive.responsiveValue(32, 48, 64),
};
