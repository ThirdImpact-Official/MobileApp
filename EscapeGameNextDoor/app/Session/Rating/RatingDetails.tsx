import React from "react"
import { useLocalSearchParams } from "expo-router"
import { View } from "react-native"
const RatingDetails: React.FC = () => {   
    const { id } = useLocalSearchParams()

    return (
        <View>
            <h1>Rating Details</h1>
            <p>Rating ID: {id}</p>
            {/* Add more details about the rating here */}
        </View>
    )
}

export default RatingDetails