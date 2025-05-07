import FormUtils from "@/classes/FormUtils";


export interface GetUserDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    picture: string;
    phoneNumber: string;
    emailVerified: boolean;
    reportCount: number;
    roleId: number | null;
    lastLogin: string;
}
export const UserColumns = [
    FormUtils.TableMapper("ID", "id"),
    FormUtils.TableMapper("username", "username"),
    FormUtils.TableMapper("first name", "firstName"),
    FormUtils.TableMapper("last name", "lastName"),
    FormUtils.TableMapper("email", "email"),
    FormUtils.TableMapper("picture", "picture"),
    FormUtils.TableMapper("email verified", "emailVerified"),
    FormUtils.TableMapper("report count", "reportCount"),
    FormUtils.TableMapper("role id", "roleId"),
];