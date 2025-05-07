import { GetActivityPlaceTypeDto } from './getActivityPlaceTypeDto';
export interface UpdateActivityPlaceDto {
    acpId: number;
    acpEsgId: number;
    name: string;
    description: string;
    activityId: number;
    address: string;
    imgressources: string;
}