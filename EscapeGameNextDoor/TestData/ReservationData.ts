// Test data for GetSessionReservedDto

import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";

const mockSessionGame: GetSessionGameDto = {
    segId: 1,
    escapeGameId: 1,
    price: 20.00,
    gameDate: new Date("2023-12-15T18:00:00Z"),
    placeMaximum: 6,
    placeAvailable: 4,
    isReserved: true,
    // ... other required properties
};

export const testReservations: GetSessionReservedDto[] = [
    {
        id: 1,
        content: "Reservation for 2 people",
        userId: "user-123",
        sessionGameId: 1,
        sessionGame: mockSessionGame,
        isCancel: false,
        cancelReason: null,
        user: null,
        isConfirmed: true,
        creationDate: "2023-12-01T10:30:00Z",
        updateDate: "2023-12-01T10:30:00Z"
    },
    {
        id: 2,
        content: "Group booking - 4 people",
        userId: "user-456",
        sessionGameId: 1,
        sessionGame: mockSessionGame,
        isCancel: false,
        cancelReason: null,
        user:null,
        isConfirmed: false,
        creationDate: "2023-12-05T14:15:00Z",
        updateDate: "2023-12-05T14:15:00Z"
    },
    {
        id: 3,
        content: "Birthday party reservation",
        userId: "user-789",
        sessionGameId: 1,
        sessionGame: mockSessionGame,
        isCancel: true,
        cancelReason: "Changed plans",
        user:null,
        isConfirmed: false,
        creationDate: "2023-11-20T09:45:00Z",
        updateDate: "2023-11-25T16:20:00Z"
    },
    {
        id: 4,
        content: "Corporate team building",
        userId: "user-101",
        sessionGameId: 1,
        sessionGame: mockSessionGame,
        isCancel: false,
        cancelReason: null,
        user:null,
        isConfirmed: true,
        creationDate: "2023-12-10T11:00:00Z",
        updateDate: "2023-12-12T10:30:00Z"
    }
];
