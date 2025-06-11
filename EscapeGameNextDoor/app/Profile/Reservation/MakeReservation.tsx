import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { UnitofAction } from "@/action/UnitofAction";
import { AddSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/addSessionReservedDto";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";

export default function MakeReservation(props: GetSessionGameDto) {
    const [form, setForm] = useState<AddSessionReservedDto>({
        content: "",
        placeReserved: 0,
        sessionGameId: props.segId,
        userId: 0,
    });
    const action = new UnitofAction();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "PlaceReserved" || name === "userId" || name === "sessionGameId"
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        action.sessionAction.addSessionReserved(form);
        console.log(form);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Make Reservation
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Places Taken"
                    type="number"
                    name="placesTaken"
                    value={form.placeReserved}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
               
                {/* sessionGameId is set from props, so it's not editable */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Submit Reservation
                </Button>
            </form>
        </Box>
    );
}