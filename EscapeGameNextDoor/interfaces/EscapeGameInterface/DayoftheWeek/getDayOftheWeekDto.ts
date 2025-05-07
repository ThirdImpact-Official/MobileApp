import FormUtils from "@/classes/FormUtils";

export interface GetDayOftheWeekDto  {
    dowId: number;
    dowName: string;
}

export const GetDayColumns=[
    FormUtils.TableMapper("ID", "dowId"),
    FormUtils.TableMapper("Nom", "downame")
]