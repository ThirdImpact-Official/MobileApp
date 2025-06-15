import { useState } from 'react';
import { useAuth } from '@/context/ContextHook/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Redirect } from 'expo-router';
import {View ,Text} from "react-native"
import React from 'react';
import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import AppView from '@/components/ui/AppView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Check, CheckCircle } from 'react-native-feather';

export default function postRegister() {

    return (
        <AppView>
            <Card>
                <Card.Title 
                    title="Inscription" 
                    subtitle="Confirmation" 
                    left={props => <CheckCircle color="#888" /> }
                    right={props => <IconSymbol {...props} name="chevron.right" color="#888" />} />
                <Card.Content>
                    <View>
                        <Text>Registration faite avec Succes</Text>
                        <Text>Un mail de confirmation a été envoyé à votre adresse e-mail.</Text>
                    </View>
                </Card.Content>
            
            </Card>
        </AppView>
    );
}
