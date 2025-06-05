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


interface ReservationItemProps {
    reservation: GetSessionReservedDto;
}
export function ReservationItem(props: ReservationItemProps) {
    const [reserv, setreserv] = useState<GetSessionReservedDto>(props.reservation);
    const rooter = useRouter();

    const Handleredirection = (item: GetSessionReservedDto) => {
        console.log("Redirecting to reservation details for:", reserv.id);
        const reservation = JSON.stringify(item);
        rooter.push({
            pathname: `/Profile/Reservation/ReservationDetails`,
            params: { reservation: reservation, }
        });
    }
    return (<>
        <Box className="flex flex-row  gap-4">
            <ItemDisplay letter={reserv.id.toString()}
                name={reserv.content}
                header={reserv.sessionGame?.gameDate.toDateString()}
                onClick={() => Handleredirection(reserv)} />

        </Box>
    </>)
}

interface ReservationColumnsProps {
    reservationcolumns: GetSessionReservedDto[];
}
export function ReservationListe(props: ReservationColumnsProps) {
    const [reserv, setreserv] = useState<GetSessionReservedDto[]>(props.reservationcolumns);
    const [loading, setLoading] = useState<boolean>(false);
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
        return (<>
            <Stack>

                <Box>
                    <List>
                    <ThemedView>
                        {reserv.map((column) => (<>
                            <ListItem>
                                <ReservationItem key={column.id.toString()} reservation={column} />
                            </ListItem>
                        </>))}
                    </ThemedView>
                    </List>
                </Box>
            </Stack>
        </>)
    }
}