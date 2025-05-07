import { UpdateAdressDto } from "../Adress/updateAdressDto";
import { UpdateOrganisationDto } from "./updateOrganisationDto";

export interface UpdateOrganisationInfoDto {
    organisation: UpdateOrganisationDto | null;
    updateAdressDto: UpdateAdressDto | null;
}