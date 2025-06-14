import React from "react"
import { useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import * as ReactNativePaper from "react-native-paper"

const RatingDetails = () => {
    const { id } = useLocalSearchParams()

    return (
        <>
            <ReactNativePaper.Card>
                <ReactNativePaper.Card.Content>
                    <ThemedText type="title">Rating Details</ThemedText>
                    <ThemedText type="default">Rating ID: {id}</ThemedText>
                </ReactNativePaper.Card.Content>
                <ReactNativePaper.Card.Actions>
                    <ReactNativePaper.Button onPress={() => console.log("Edit Rating")}>
                        Edit Rating
                    </ReactNativePaper.Button>
                </ReactNativePaper.Card.Actions>
            </ReactNativePaper.Card>
            <ThemedView>
                <ThemedText type="title">Rating Details</ThemedText>
                <ThemedText type="default">Rating ID: {id}</ThemedText>
                {/* Add more details about the rating here */}
            </ThemedView>
        </>
    )
}

export default RatingDetails