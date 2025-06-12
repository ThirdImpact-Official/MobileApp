import { Box, Stack } from "@mui/system";
import { Skeleton } from "@mui/material";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import React from 'react';
import { useRouter } from "expo-router";

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
            params: { escapeGame: data }
        });
    };

    if (!data || data.length === 0) {
        return (
            <Stack>
                <Box>
                    <Skeleton />
                </Box>
            </Stack>
        );
    }

    return (
        <Stack>
            <Box>
                {data.map(item => (
                    <FavorisItem key={item.esgId?.toString() || Math.random().toString()} item={item} onRedirect={HandleRedirection} />
                ))}
            </Box>
        </Stack>
    );
}

type PropsItem = {
    item: GetEscapeGameDto;
    onRedirect: (item: GetEscapeGameDto) => void;
};

export function FavorisItem({ item, onRedirect }: PropsItem) {
    return (
        <Box className="space-y-2">
            <ItemDisplay
                letter={item.esgId?.toString() || ""}
                name={item.esgNom}
                header={item.esg_CreationDate}
                img={item.esgImgResources}
                onClick={() => onRedirect(item)}
            />
        </Box>
    );
}
