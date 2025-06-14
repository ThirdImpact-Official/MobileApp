
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import React from 'react';
import { useRouter } from "expo-router";
import { Box } from "react-native-feather";
import Stack from "@/components/factory/GenericComponent/Stack";
import { ActivityIndicator, View } from 'react-native';
import { ThemedView } from "@/components/ThemedView";

type Props = {
    item?: GetEscapeGameDto[];
};

export default function FavorisComponent({ item }: Props) {
    const [data, setData] = React.useState<GetEscapeGameDto[] | null>(item || null);
    const router = useRouter();

    // Redirection avec passage des données en stringifiée
    const HandleRedirection = (item: GetEscapeGameDto) => {
        console.log("Redirecting to favoris details");
        const data = JSON.stringify(item);
        router.push({
            pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
            params: { id: item.esgId,  }
        });
    };

    if (!data || data.length === 0) {
        return (
            <view>
                <Box>
                    <ActivityIndicator/>
                </Box>
            </view>
        );
    }

    return (
        <view>
            <view>
                {data.map(item => (
                    <FavorisItem key={item.esgId?.toString() || Math.random().toString()} item={item} onRedirect={HandleRedirection} />
                ))}
            </view>
        </view>
    );
}

type PropsItem = {
    item: GetEscapeGameDto;
    onRedirect: (item: GetEscapeGameDto) => void;
};

export function FavorisItem({ item, onRedirect }: PropsItem) {

    return (
        <ThemedView className="space-y-2">
            <ItemDisplay
                letter={item.esgId?.toString() || ""}
                name={item.esgNom}
                header={item.esg_CreationDate}
                img={item.esgImgResources}
                onClick={() => onRedirect(item)}
            />
        </ThemedView>
    );
}
