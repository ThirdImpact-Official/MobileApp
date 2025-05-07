import FormUtils from "@/classes/FormUtils";

export interface GetPriceDto {
    id: number;
    indicePrice: number;
}

export const PriceTypeColumns  =[
    FormUtils.TableMapper("ID", "id"),
    FormUtils.TableMapper("indice de prix de l'escape game", "indicePrice"),
]