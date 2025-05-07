import FormUtils from "@/classes/FormUtils";

export interface GetAdressDto {
    adressId: number;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export const AdressColumns = [
    FormUtils.TableMapper("ID", "adressId"),
    FormUtils.TableMapper("street", "street"),
    FormUtils.TableMapper("postal code", "postalCode"),
    FormUtils.TableMapper("city", "city"),
    FormUtils.TableMapper("country", "country"),
    FormUtils.TableMapper("latitude", "latitude"),
    FormUtils.TableMapper("longitude", "longitude"),
];