export interface UpdateUserDto{
    id: number,
    username: string,
    email: string,
    firstName:string,
    lastName:string,
}
export interface UpdatePictureDto{
    picture: File,
}