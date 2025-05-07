export interface UpdateEventDto {
    eventId: number;
    escapegameId: number;
    eventTitle: string;
    eventDescription: string;
    startDate: Date;
    endDate: Date;
}