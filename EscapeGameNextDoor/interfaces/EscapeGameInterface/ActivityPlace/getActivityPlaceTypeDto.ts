import FormUtils from "@/classes/FormUtils";

export interface GetActivityPlaceTypeDto  {
    id: number;
    name: string;
}

export const ActivityTypeColumns=[
    FormUtils.TableMapper("ID", "id"),
    FormUtils.TableMapper("Nom", "name")
]