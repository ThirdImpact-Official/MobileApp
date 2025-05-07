export interface GetSignalementDto extends BaseDto {
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