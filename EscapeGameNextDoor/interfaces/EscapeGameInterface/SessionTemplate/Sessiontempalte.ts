export interface GetSessionTemplateDto {
    id: number;
    escapeGameId: number;
    startTime: string;
    durationMinute: number;
    price: number;
    maxPlayers: number;
    isValidForMonday: boolean;
    isValidForTuesday: boolean;
    isValidForWednesday: boolean;
    isValidForThursday: boolean;
    isValidForFriday: boolean;
    isValidForSaturday: boolean;
    isValidForSunday: boolean;
}

export interface AddSessionTemplateDto {
    escapeGameId: number;
    startTime: string;
    durationMinute: number;
    price: number;
    maxPlayers: number;
    isValidForMonday: boolean;
    isValidForTuesday: boolean;
    isValidForWednesday: boolean;
    isValidForThursday: boolean;
    isValidForFriday: boolean;
    isValidForSaturday: boolean;
    isValidForSunday: boolean;
}

export interface UpdateSessionTemplateDto {
    id: number;
    escapeGameId: number;
    startTime: string;
    durationMinute: number;
    price: number;
    maxPlayers: number;
    isValidForMonday: boolean;
    isValidForTuesday: boolean;
    isValidForWednesday: boolean;
    isValidForThursday: boolean;
    isValidForFriday: boolean;
    isValidForSaturday: boolean;
    isValidForSunday: boolean;
}