import { CardContent, CardHeader, Card, Paper,Typography } from "@mui/material";


export default function paymentSuccces()
{
    return (<>
        <Paper elevation={2}>
            <Card>
                <CardHeader 
                    title="Payment Success"
                />
                <CardContent>
                <Typography>
                        Votre payment a été Valider.
                    </Typography>    
                </CardContent>
            </Card>
        
        </Paper>
    </>)
}