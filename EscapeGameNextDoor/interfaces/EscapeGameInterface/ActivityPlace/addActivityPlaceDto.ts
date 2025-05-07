import { GetActivityPlaceTypeDto } from "./getActivityPlaceTypeDto";

export interface AddActivityPlaceDto  {
    acpEsgId: number;
    activityId: number;
    name: string;
    description: string;
    address: string;
    imgressources: string;
}