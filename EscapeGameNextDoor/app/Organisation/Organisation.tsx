import { Card } from "@mui/material";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import AspectRatio from "@mui/joy/AspectRatio";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import ListDivider from "@mui/joy/ListDivider";
import { useEffect, useState } from "react";
import { UnitofAction } from "@/action/UnitofAction";
import { GetOrganisationDto } from "@/interfaces/OrganisationInterface/Organisation/getOrganisationDto";
import { useToasted } from "@/context/ContextHook/ToastedContext";

export default function OrganisationListStackRatio() {
    const action = new UnitofAction();
    const [organisations, setOrganisations] = useState<GetOrganisationDto[]>([]);
    const [page, setPage] = useState<number>(1);
    const notif = useToasted();

    useEffect(() => {
        const fetchOrganisation = async () => {
            try {
                const response = await action.organisationAction.GetAllOrganisation(page, 5);
                if (response.Success) {
                    setOrganisations(response.Data as GetOrganisationDto[]);
                    notif.showToast(response.Message, "success");
                } else {
                    notif.showToast(response.Message, "error");
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchOrganisation();
    }, [page]);

    return (
        <Card variant="outlined" sx={{ width: 300, p: 0 }}>
            <List sx={{ py: 'var(--ListDivider-gap)' }}>
                {organisations.map((organisation, index) => (
                    <div key={organisation.orgId || organisation.name}>
                        <ListItem>
                            <ListItemButton
                                onClick={() => {
                                    
                                }}
                                sx={{ gap: 2 }}>
                                <AspectRatio sx={{ flexBasis: 60 }}>
                                    <img
                                        src={organisation.logo}
                                        alt={organisation.name}
                                        style={{ objectFit: "cover" }}
                                    />
                                </AspectRatio>
                                <ListItemContent>
                                    <Typography sx={{ fontWeight: 'md' }}>{organisation.name}</Typography>
                                    <Typography level="body-sm">{organisation.description}</Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </ListItem>
                        {index !== organisations.length - 1 && <ListDivider />}
                    </div>
                ))}
            </List>
        </Card>
    );
}
