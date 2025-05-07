import { DemandStatus } from './DemandStatut';
import FormUtils from "@/classes/FormUtils";

export interface GetAdminDemandDto {
    id: number;
    title: string;
    content: string;
    contactNumber: string;
    statut: DemandStatus;
    creationDate: string;
    updateDate: string;
    motifRefus: string;
    commentairesAdmin: string;
    traiteeParAdminId: number | null;
    userId: number;
    organisationId: number | null;
}

export const ColumnsAdm: Array<{label: string; accessor: keyof GetAdminDemandDto}> = [
    FormUtils.TableMapper("Id", "id"),
    FormUtils.TableMapper("Title", "title"),
    FormUtils.TableMapper("Content","content"),
    FormUtils.TableMapper("Contact","contactNumber"),
    FormUtils.TableMapper("Date","creationDate"),
    FormUtils.TableMapper("mise a jour","updateDate"),
    FormUtils.TableMapper("Commentaires","commentairesAdmin")
]

export const ColumnsAdmTable: Array<{label: string; accessor: keyof GetAdminDemandDto}> = [
    FormUtils.TableMapper("Id", "id"),
    FormUtils.TableMapper("Title", "title"),
    FormUtils.TableMapper("Content","content"),
    FormUtils.TableMapper("Status","statut"),
    FormUtils.TableMapper("Date","creationDate"),
    FormUtils.TableMapper("mise a jour","updateDate"),

]