import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";

// Test data for GetSessionGameDto
export const testSessionGames: GetSessionGameDto[] = [
    {
        segId: 1,
        escapeGameId: 101,
        gameDate: new Date("2023-12-15T18:00:00"),
        price: 25.99,
        isReserved: true,
        placeAvailable: 2,
        placeMaximum: 10
    },
    {
        segId: 2,
        escapeGameId: 101,
        gameDate: new Date("2023-12-16T14:30:00"),
        price: 29.99,
        isReserved: false,
        placeAvailable: 8,
        placeMaximum: 10
    },
    {
        segId: 3,
        escapeGameId: 102,
        gameDate: new Date("2023-12-17T20:00:00"),
        price: 35.50,
        isReserved: false,
        placeAvailable: 10,
        placeMaximum: 10
    },
    {
        segId: 4,
        escapeGameId: 103,
        gameDate: new Date("2023-12-18T16:00:00"),
        price: 22.00,
        isReserved: true,
        placeAvailable: 0,
        placeMaximum: 6
    },
    {
        segId: 5,
        escapeGameId: 102,
        gameDate: new Date("2023-12-19T19:00:00"),
        price: 35.50,
        isReserved: true,
        placeAvailable: 1,
        placeMaximum: 10
    }
];
