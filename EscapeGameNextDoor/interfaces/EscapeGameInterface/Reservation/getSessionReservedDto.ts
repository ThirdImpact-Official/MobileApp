import FormUtils from "@/classes/FormUtils";
import { GetSessionGameDto } from "../Session/getSessionGameDto";
import { GetUserDto } from "@/interfaces/User/GetUserDto";

export interface GetSessionReservedDto {
    id: number;
    content: string;
    userId: string;
    sessionGameId: number;
    sessionGame: GetSessionGameDto | null;
    isCancel: boolean;
    cancelReason: string | null;
    user: GetUserDto | null;
    isConfirmed: boolean;
    creationDate: string;
    updateDate: string;
}
export const reservationcolumns: Array<{ label: string; accessor: keyof GetSessionReservedDto }> = [
    FormUtils.TableMapper("ID", "id"),
    FormUtils.TableMapper("Content", "content"),
    FormUtils.TableMapper("isCancel", "isCancel"),
    FormUtils.TableMapper("Cancel Reason", "cancelReason"),
    FormUtils.TableMapper("Confirmation", "isConfirmed"),
    FormUtils.TableMapper("Date de creation", "creationDate"),
];
