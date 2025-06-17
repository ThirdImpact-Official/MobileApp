import FormUtils from '@/classes/FormUtils';
import { GetAdressDto } from '../Adress/getAdressDto';
export interface GetOrganisationDto  {
  //  orgId: number;
   // name: string;
  //  email: string;
  //description: string;
 //   phoneNumber: string;
  //  address:  string |null;
  orgId: number;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  addresseId: number;
  website: string;
  isActive: boolean;
  logo: string;
  creationDate: string;  // Utilisation de string pour gérer la date au format ISO
  updateDate: string; 
}

export const OrganisationColumns = [
    FormUtils.TableMapper("Id", "orgId"),
    FormUtils.TableMapper("name", "name"),
    FormUtils.TableMapper("email", "email"),
    FormUtils.TableMapper("phone number", "phoneNumber"),
    FormUtils.TableMapper("description", "description"),
];