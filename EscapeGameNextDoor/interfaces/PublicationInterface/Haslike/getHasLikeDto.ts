import { GetTypeLikeDto } from "../TypeLike/gettypeLikeDto";

export interface GetHasLikeDto  {
    id: number;
    pubId: number;
    userId: string;
    typeLIke: GetTypeLikeDto | null;
    creationDate: string;
    updateDate: string;
}