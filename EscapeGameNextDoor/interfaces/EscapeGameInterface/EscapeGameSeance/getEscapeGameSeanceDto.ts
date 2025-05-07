import FormUtils from "@/classes/FormUtils";

export interface GetEscapeGameSeance{  
    escapeGameSeanceId: number;
    dayofWeek: number;
    escapegameId: number;
    openTime: string;
    closeTime: string;
}
export  const EscapeGameSeanceColumns=[
    FormUtils.TableMapper("ID", "escapegameSeanceid"),
    FormUtils.TableMapper("day of week", "dayofweek"),
    FormUtils.TableMapper("escape game id", "escapegameid"),
    FormUtils.TableMapper("open time", "opentime"),
    FormUtils.TableMapper("close time", "closetime"),
]