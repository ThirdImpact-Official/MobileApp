import { Children } from "react";
import ParallaxScrollView from "../ParallaxScrollView";
import { useColorScheme, View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";
import React from "react";

type props={
    children:React.ReactNode
}
export default function AppView(props: props) {
    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<Image source={require('@/assets/images/partial-react-logo.png')}
                  style={styles.reactLogo} />}>
                    {props.children}
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});