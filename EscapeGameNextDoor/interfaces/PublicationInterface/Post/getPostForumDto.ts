export interface GetPostForumDto {
    id: number;
    content: string;
    userId: number;
    forumId: number | null;
    postparentId: number | null;
    hasLikeId: number | null;
    hasLike: HasLike | null;
    creationDate: string;
    updatedDate: string;
}

export interface HasLike {  
    id: number;
} 