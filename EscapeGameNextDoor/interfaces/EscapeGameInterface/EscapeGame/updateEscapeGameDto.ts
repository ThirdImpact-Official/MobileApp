export interface UpdateEscapeGameDto  {
    esgId: number;
    esgNom: string;
    esgCreator: string;
    esgTitle: string;
    esgContent: string;
    esgImgResources: string;
    esgWebsite: string;
    esgPhoneNumber: string;
    esg_IsForChildren: boolean;
    esg_Price_Id: number;
    esg_DILE_Id: number;
}