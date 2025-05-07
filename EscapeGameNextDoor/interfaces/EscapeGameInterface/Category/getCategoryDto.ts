import FormUtils from "@/classes/FormUtils";

export interface GetCategoryDto  {
    catId: number;
    catName: string;
}

export const CategoryTypeColumns=[
    FormUtils.TableMapper("ID", "catId"),
    FormUtils.TableMapper("Nom", "CatName")
]