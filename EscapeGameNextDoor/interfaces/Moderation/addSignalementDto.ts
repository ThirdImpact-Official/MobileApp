export interface AddSignalementDto {
    forumId: number | null;
    postForumId: number | null;
    userId: number;
    signalementTypeId: number;
    description: string | null;
    isPertinent: boolean;
    isClosed: boolean;
}