export interface AddSignalementForumDto {
    forumId: number | null;
    postForumId: number | null;
    userId: number;
    signalementTypeId: number;
    content: string | null;
}