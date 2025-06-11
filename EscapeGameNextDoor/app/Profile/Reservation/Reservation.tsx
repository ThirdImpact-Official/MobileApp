import { Box, Button, Card, CardActions, CardContent, CardHeader, List, ListItem, Skeleton, Stack, Typography } from "@mui/material";
import { Text } from "react-native";
import { GetSessionReservedDto, reservationcolumns } from '../../../interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';
import { GetSessionGameDto } from '../../../interfaces/EscapeGameInterface/Session/getSessionGameDto';
import { useState } from "react";
import FormUtils from '@/classes/FormUtils';
import { ThemedView } from "@/components/ThemedView";
import ItemDisplay from "@/components/factory/GenericComponent/ItemDisplay";
import { useRouter } from "expo-router";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import AspectRatio from "@mui/joy/AspectRatio";
import ListItemContent from "@mui/joy/ListItemContent";
import ListDivider from "@mui/joy/ListDivider";




interface ReservationColumnsProps {
    reservationcolumns: GetSessionReservedDto[];
}
export function ReservationListe(props: ReservationColumnsProps) {
    const [reserv, setreserv] = useState<GetSessionReservedDto[]>(props.reservationcolumns);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
     const Handleredirection = (item: GetSessionReservedDto) => {
        
        const reservation = JSON.stringify(item);
        router.push({
            pathname: `/Profile/Reservation/ReservationDetails`,
            params: { reservation: reservation, }
        });
    }

    if (reserv.length === 0) {
        return (
            <Stack>
                <Box>
                    <ThemedView>
                        <Skeleton
                            className=" md:w-1/2"
                        />
                    </ThemedView>
                </Box>
            </Stack>
        );
    }
    else {
        return (
            <Card variant="outlined" sx={{ width: 350, p: 0 }}>
            <List sx={{ py: 'var(--ListDivider-gap)' }}>
                {reserv.map((column, index) => (
                <React.Fragment key={column.id.toString()}>
                    <ListItem>
                    <ListItemButton sx={{ gap: 2 }} onClick={() => {}}>
                        <AspectRatio sx={{ flexBasis: 80 }}>
                        {/* Placeholder image or icon */}
                        <img
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${column.id}`}
                            alt={column.content}
                        />
                        </AspectRatio>
                        <ListItemContent>
                        <Typography sx={{ fontWeight: 'md' }}>
                            {column.content}
                        </Typography>
                        <Typography variant="body2">
                            {column.sessionGame?.gameDate?.toLocaleString?.() || ''}
                        </Typography>
                        </ListItemContent>
                    </ListItemButton>
                    </ListItem>
                    {index !== reserv.length - 1 && <ListDivider />}
                </React.Fragment>
                ))}
            </List>
            </Card>
        )
    }
}