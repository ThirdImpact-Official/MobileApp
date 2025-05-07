import FormUtils from "@/classes/FormUtils";
import { GetActivityPlaceTypeDto } from "./getActivityPlaceTypeDto";

export interface GetActivityPlaceDto  {
    acpId: number;
    acpEsgId: number;
    name: string;
    description: string;
    activityType: GetActivityPlaceTypeDto | null;
    activityId: number;
    address: string;
    imgressources: string;
    creationDate: string;
    updateDate: string;
}
export const ActivityPlaceColumns : Array<{ label: string; accessor: keyof GetActivityPlaceDto}> =
[
    FormUtils.TableMapper<GetActivityPlaceDto>("ID", "acpId"),
    FormUtils.TableMapper<GetActivityPlaceDto>("ID Escape Game", "acpEsgId"),
    FormUtils.TableMapper<GetActivityPlaceDto>("ID Activité", "activityId"),
    FormUtils.TableMapper<GetActivityPlaceDto>("Adresse", "address"),
    FormUtils.TableMapper<GetActivityPlaceDto>("Images", "imgressources"),
    FormUtils.TableMapper<GetActivityPlaceDto>("Date de création", "creationDate"),
    FormUtils.TableMapper<GetActivityPlaceDto>("Dernière mise à jour", "updateDate"),
];
