import FormUtils from "@/classes/FormUtils";

export interface GetEventDto {
    eventId: number;
    escapegameId: number;
    eventTitle: string;
    eventDescription: string;
    startDate: Date;
    endDate: Date;
}
export const EventTypeColumns=[
    FormUtils.TableMapper("ID", "eventId"),
    FormUtils.TableMapper("titre", "eventTitle"),
    FormUtils.TableMapper("description", "eventDescription"),
    FormUtils.TableMapper("date de debut", "startDate"),
    FormUtils.TableMapper("date de fin", "endDate")
]