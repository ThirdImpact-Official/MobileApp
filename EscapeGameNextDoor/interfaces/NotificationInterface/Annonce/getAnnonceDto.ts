import FormUtils from '../../../classes/FormUtils';

export interface GetAnnonceDto{
    id: number;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
}

export const AnnonceColumns: Array<{ label: string; accessor: keyof GetAnnonceDto }> = [
    FormUtils.TableMapper("Id", "id"),
    FormUtils.TableMapper("Name", "name"),
    FormUtils.TableMapper("Description", "description"),
    FormUtils.TableMapper("CreationDate", "createdDate"),
    FormUtils.TableMapper("UpdateDate", "updatedDate"),
];

export const AnnonceColumnsTab: Array<{ label: string; accessor: keyof GetAnnonceDto }> = [
    FormUtils.TableMapper("Id", "id"),
    FormUtils.TableMapper("Name", "name"),
    FormUtils.TableMapper("CreationDate", "createdDate"),
  
];
