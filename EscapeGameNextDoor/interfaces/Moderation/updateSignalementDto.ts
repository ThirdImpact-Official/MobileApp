export interface UpdateSignalementDto{
    id: number;
    forumId: number;
    postForumId: number;
    userId: number;
    signalementTypeId: number;
    description: string | null;
    isPertinent: boolean;
    isClosed: boolean;
    creationDate: string;
    updateDate: string;
}