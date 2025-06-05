import FormUtils from "@/classes/FormUtils";
import { GetDifficultyLevelDto } from "../DifficultyLevel/getDifficultyLevelDto";
import { GetPriceDto } from "../Price/getPriceDto";

export interface GetEscapeGameDto {
    esgId: number;
    esgNom: string;
    esgCreator: string;
    esgTitle: string;
    esgContent: string;
    esgImgResources: string;
    esgWebsite: string;
    esgPhoneNumber: string;
    esg_IsDeleting: boolean;
    esg_IsForChildren: boolean;
    esg_Price_Id: number;
    esg_DILE_Id: number;
    price: GetPriceDto | null;
    difficultyLevel: GetDifficultyLevelDto | null;
    esg_CreationDate: string;
    esg_UpdateTime: string;
}
export const EscapeGameColumns: Array<{ label: string; accessor: keyof GetEscapeGameDto }> = [
    FormUtils.TableMapper("ID", "esgId"),
    FormUtils.TableMapper("Nom", "esgNom"),
    FormUtils.TableMapper("Créateur", "esgCreator"),
    FormUtils.TableMapper("Titre", "esgTitle"),
    FormUtils.TableMapper("Description", "esgContent"),
    FormUtils.TableMapper("Image", "esgImgResources"),
    FormUtils.TableMapper("Site Web", "esgWebsite"),
    FormUtils.TableMapper("Téléphone", "esgPhoneNumber"),
    FormUtils.TableMapper("Supprimé ?", "esg_IsDeleting"),
    FormUtils.TableMapper("Pour Enfants ?", "esg_IsForChildren"),
    FormUtils.TableMapper("ID Prix", "esg_Price_Id"),
    FormUtils.TableMapper("ID Difficulté", "esg_DILE_Id"),
    FormUtils.TableMapper("Prix", "price"),
    FormUtils.TableMapper("Niveau de difficulté", "difficultyLevel"),
    FormUtils.TableMapper("Date de création", "esg_CreationDate"),
    FormUtils.TableMapper("Dernière mise à jour", "esg_UpdateTime"),
];

