import FormUtils from "@/classes/FormUtils";

export interface GetSessionGameDto {
    segId: number;
    escapeGameId: number;
    gameDate: Date;
    price: number;
    isReserved: boolean;
    placeAvailable: number;
    placeMaximum: number;
}

// Définition correcte des colonnes
export const Sessioncolumns: Array<{ label: string; accessor: keyof GetSessionGameDto }> = [
    FormUtils.TableMapper("ID", "segId"),
    FormUtils.TableMapper("Escape Game ID", "escapeGameId"),
    FormUtils.TableMapper("Date", "gameDate"),
    FormUtils.TableMapper("Price", "price"),
    FormUtils.TableMapper("Is Reserved", "isReserved"),
    FormUtils.TableMapper("Places Available", "placeAvailable"),
    FormUtils.TableMapper("Max Places", "placeMaximum"),
];
