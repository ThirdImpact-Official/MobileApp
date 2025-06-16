import { Children } from "react";
import ParallaxScrollView from "../ParallaxScrollView";
import { useColorScheme, View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";
import React from "react";
import { styles } from '../../constants/styles';
import { AuthContext, useAuth } from '../../context/ContextHook/AuthContext';
import { Redirect } from "expo-router";

type props={
    children:React.ReactNode

}
export default function AppView(props: props) {
  const myauth=useAuth();
  const isAuth= myauth.isAuthenticated;
    if(isAuth)
    {
      <Redirect href='/Authentication/Login'/>
    }

    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<Image source={require('@/assets/images/partial-react-logo.png')}
                  style={styleds.reactLogo} />}>
                    {props.children}
        </ParallaxScrollView>
    );
};

const styleds = StyleSheet.create({
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