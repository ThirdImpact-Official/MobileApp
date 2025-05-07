export interface UpdatePostForumDto extends UpdateDto {
    id: number;
    content: string;
    userId: number;
    forumId: number | null;
    postparentId: number | null;
}