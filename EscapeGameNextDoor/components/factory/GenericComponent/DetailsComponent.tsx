import RenderDetail from "./RenderDetails";
import { Box, Typography, styled, Card, CardContent, CardHeader, Stack, Divider } from '@mui/material';

interface DetailsProps<T> {
    data: T;
    columns: { label: string; accessor: keyof T }[];
}

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
        boxShadow: theme.shadows[6],
        transform: 'translateY(-4px)',
    },
}));

const StyledHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(3),
    textAlign: 'center',
}));

const StyledContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(3),
}));

// Component
const DetailsComponent = <T,>({ data, columns }: DetailsProps<T>) => {
    if (!data) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <Typography variant="h5" color="text.secondary">
                    Aucune donnée disponible
                </Typography>
            </Box>
        );
    }

    return (
        <StyledCard variant="outlined">
            <StyledHeader
                title={
                    <Typography variant="h5" component="h2">
                        Détails
                    </Typography>
                }
            />
            <StyledContent>
                <Stack spacing={2}>
                    {columns.map((column, index) => (
                        <Box key={column.accessor as string}>
                            <RenderDetail
                                label={column.label}
                                value={data[column.accessor]}
                            />
                            {index < columns.length - 1 && <Divider sx={{ mt: 1, mb: 1 }} />}
                        </Box>
                    ))}
                </Stack>
            </StyledContent>
        </StyledCard>
    );
};

export default DetailsComponent;
