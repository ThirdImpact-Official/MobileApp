export interface AddPostForumDto {
    content: string;
    userId: number;
    forumId: number | null;
    postparentId: number | null;
}