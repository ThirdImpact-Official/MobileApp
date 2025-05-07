export interface UpdateOrganisationDto {
    orgId: number;
    name:string;
    description: string;
    email: string;
    phoneNumber: string;
    file?: File | null
}