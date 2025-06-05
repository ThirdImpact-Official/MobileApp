import { CardContent, CardHeader, Card, Paper, Typography } from "@mui/material";

export default function PaymentFaild()
{
    return(<>
        <Paper elevation={2}>
            <Card elevation={2}>
                <CardHeader 
                    title="Payment Failed"
                    />
                <CardContent>
                    <Typography>
                        Votre payment à echouer
                    </Typography>
                </CardContent>
            </Card>
        </Paper>

    </>);
}