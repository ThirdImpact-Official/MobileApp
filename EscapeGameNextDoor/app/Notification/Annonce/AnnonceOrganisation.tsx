import { useEffect, useState } from "react";
import { useLocalSearchParams } from 'expo-router';
import { UnitofAction } from "@/action/UnitofAction";
import AppView from "@/components/ui/AppView";
import { GetAnnonceDto } from "@/interfaces/NotificationInterface/Annonce/getAnnonceDto";
import { Pagination, Card, List, ListItem, ListItemButton, Typography, Divider, Box } from "@mui/material";
import ListItemContent from "@mui/joy/ListItemContent";
import AspectRatio from '@mui/joy/AspectRatio';
import ListDivider from '@mui/joy/ListDivider';

export default function AnnonceOrganisation() {
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [annonce, setAnnonce] = useState<GetAnnonceDto[]>([]);
    const [page, setPage] = useState<number>(1);
    const action = new UnitofAction();

    const fetchAnnonce = async () => {
        try {
            const response = await action.annonceAction.GetAllAnnonceByOrganisationId(Number(id), page, 5);
            if (response.Success) {
                setAnnonce(response.Data as GetAnnonceDto[]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnonce();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, id]);

    return (
        <AppView>
            <Card variant="outlined" sx={{ width: 300, p: 0 }}>
                <List sx={{ py: 'var(--ListDivider-gap)' }}>
                    {annonce.map((item, index) => (
                        <Box key={item.id}>
                            <ListItem>
                                <ListItemButton sx={{ gap: 2 }}>
                                    <AspectRatio sx={{ flexBasis: 120 }}>
                                        <img
                                            srcSet={`${item.image}?w=120&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${item.image}?w=120&fit=crop&auto=format`}
                                            alt={item.name}
                                        />
                                    </AspectRatio>
                                    <ListItemContent>
                                        <Typography sx={{ fontWeight: 'md' }}>{item.name}</Typography>
                                        <Typography variant="body2">{item.description}</Typography>
                                    </ListItemContent>
                                </ListItemButton>
                            </ListItem>
                            {index !== annonce.length - 1 && <ListDivider />}
                        </Box>
                    ))}
                </List>
            </Card>
            <Pagination
                count={Math.ceil(annonce.length / 5)}
                page={page}
                onChange={(_, value) => setPage(value)}
            />
        </AppView>
    );
}
