export interface UpdatePostForumDto  {
    id: number;
    content: string;
    userId: number;
    forumId: number | null;
    postparentId: number | null;
}