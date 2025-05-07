export interface UpdateSessionReservedDto{
    id: number;
    content: string;
    userId: string;
    sessionGameId: number;
    isCancel: boolean;
    isConfirmed: boolean;
}