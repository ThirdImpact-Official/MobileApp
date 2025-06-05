import { FC } from "react";
import {
    Table,
    TableRow,
    TableCell,
    TableContainer,
    TableHead,
    TableBody,
    Button,
    Paper,
    Skeleton,
    Typography,
    Box,
    Stack,
} from "@mui/material";
import FormUtils from "@/classes/FormUtils";

interface GenerationTableProps<T> {
    data: T[];
    columns: { label: string; accessor: keyof T }[];
    OnDetails?: (item: T) => void;
    OnUpdate?: (item: T) => void;
}

const GenericTable = <T,>({
    data,
    columns,
    OnDetails,
    OnUpdate
}: GenerationTableProps<T>) => {
    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                    No results found.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer 
            component={Paper} 
            className="hover:shadow-2xl transition-all"
            sx={{ borderRadius: 2, overflow: "auto" }}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={String(col.accessor)}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {col.label}
                                </Typography>
                            </TableCell>
                        ))}
                        {(OnDetails || OnUpdate) && (
                            <TableCell align="center">
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Actions
                                </Typography>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index} hover>
                            {columns.map((col) => {
                                const value = item[col.accessor];
                                const isDate =
                                    value instanceof Date ||
                                    (typeof value === "string" && !isNaN(Date.parse(value)));

                                return (
                                    <TableCell key={String(col.accessor)}>
                                        {isDate
                                            ? FormUtils.FormatDate(value?.toString() ?? "")
                                            : value != null
                                            ? String(value)
                                            : ""}
                                    </TableCell>
                                );
                            })}
                            {(OnDetails || OnUpdate) && (
                                <TableCell>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            {OnDetails && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => OnDetails(item)}
                                                >
                                                    Details
                                                </Button>
                                            )}
                                            {OnUpdate && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => OnUpdate(item)}
                                                >
                                                    Update
                                                </Button>
                                            )}
                                        </Box>

                                    </Stack>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default GenericTable;
