import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useState, useEffect, useRef } from "react";
import { Image, Text } from 'react-native';
import { styles } from '../../constants/styles';
import { Card, CardContent, CardActions, CardHeader, Stack, Box, Grid, Link, Typography, Divider } from '@mui/material';
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { useAuth } from "@/context/ContextHook/AuthContext";
import { Collapsible } from "@/components/Collapsible";
import GenericTable from "@/components/factory/GenericComponent/GenericTable";
import "./ProfileComponent.css"
import { ThemedText } from "@/components/ThemedText";

type profileprops = {
    user: GetUserDto;
};
export default function ProfileComponent(props: profileprops) {

    const Getprofile = props.user;
    const { isAuthenticated, isLoading } = useAuth();
    const [profile, setProfile] = useState<GetUserDto>(Getprofile);

    return (
        <Grid container justifyContent="center">
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 600, margin: "auto", padding: 2 }}>
                <Card className="card" elevation={3}>
                    <CardHeader
                        className="card-header"
                        title={
                            <Box>
                                <ThemedText>
                                    <Typography component="p">{Date.now().toLocaleString()}</Typography>
                                    <Typography className="title" variant="h6">{Getprofile.username}</Typography>
                                </ThemedText>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Box className="card-author" display="flex" alignItems="center">
                            <Link href="#" className="author-avatar">
                                <span></span>
                            </Link>
                            <svg className="half-circle" viewBox="0 0 106 57" style={{ height: 30 }}>
                                <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                            </svg>
                            <Box className="author-name" ml={2}>
                                <ThemedText>
                                    <Typography className="author-name-prefix" variant="caption">Nom</Typography>{" "}
                                    {Getprofile.firstName + " " + Getprofile.lastName}
                                    <Divider orientation="horizontal" />
                                    <Typography className="author-name-prefix" variant="caption">Mail</Typography>{" "}
                                    {Getprofile.email}
                                </ThemedText>
                            </Box>

                        </Box>
                    </CardContent>
                    <CardActions>

                        <Box className="tags" mt={2} display="flex" gap={1} flexWrap="wrap">
                            <Link href="#" className="tag">Reservation</Link>
                            <Link href="#" className="tag">Favoris </Link>
                            <Link href="#" className="tag">Forum</Link>
                        </Box>
                    </CardActions>
                </Card>
            </Stack>
        </Grid>
    );
}