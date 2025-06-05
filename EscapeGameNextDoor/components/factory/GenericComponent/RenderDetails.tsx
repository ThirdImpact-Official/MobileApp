import FormUtils from "@/classes/FormUtils";
import {  Stack, Typography,Box } from "@mui/material";

import { FC } from "react";
import Item from "./Item";

interface RenderProps {
    label: string;
    value?: unknown;
}

const RenderDetail: FC<RenderProps> = ({ label, value }) => {

    const formatValue = (value: unknown): string => {
        if (value === null || value === undefined) return '';

        if (typeof value === 'number') {
            return value.toFixed(2);
        }

        if (typeof value === 'string') {
            // Vérifie si c'est une date ISO et la convertit
            if (!isNaN(Date.parse(value))) {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }); // Format MM/DD/YYYY
            }
            return value;
        }

        if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
        }

        if (value instanceof Date) {
            return value.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }); // Format MM/DD/YYYY
        }

        if (typeof value === 'object') {
            if (FormUtils.isGetDifficultyLevelDto(value)) {
                return value.dowName;
            }

            if (FormUtils.isGetPriceDto(value)) {
                return value.indicePrice.toString();
            }

            return JSON.stringify(value, null, 2); // Format JSON plus lisible
        }

        return '';
    };

    return (
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start" sx={{ width: '100%' }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            {label}:
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap', textAlign: 'right' }}>
            {formatValue(value)}
        </Typography>
    </Stack>
    );
};

export default RenderDetail;
