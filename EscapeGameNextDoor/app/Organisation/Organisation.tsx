import { FC, useEffect, useState } from "react";
import { UnitofAction } from "@/action/UnitofAction";
import { GetOrganisationDto } from "@/interfaces/OrganisationInterface/Organisation/getOrganisationDto";
import { useToasted } from "@/context/ContextHook/ToastedContext";

const Organisation = () => {
    const action = new UnitofAction();
    const [organisation, setOrganisation] = useState<GetOrganisationDto[]>([]);
    const [page, setPage] = useState<number>(1)
    const notif= useToasted();

    const fetchOrganisation = async () => {
        try {
            const response= await action.organisationAction.GetAllOrganisation(page,5);
            if (response.Success) {
                setOrganisation(response.Data as GetOrganisationDto[]);
                notif.isvisible=true;
                notif.showToast(response.Message,"success");            
            }
            else {
                notif.isvisible=true;
                notif.showToast(response.Message,"error");     
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        fetchOrganisation();
    },[page]);
    return (
        <>

    </>)
};
export default Organisation;

//-------------------------------//
//--------- Organisation Item----//
//-------------------------------//
interface OrganisationTableProps {
    data: GetOrganisationDto[];
}
const OrgansisationTotal:FC<OrganisationTableProps> = (props) => {

    return(
        <>

        </>)
}

interface OrganisationItemProps{
    organisation: GetOrganisationDto;
}
const OrganisationItem: FC<OrganisationItemProps> = ({ organisation }) => {
    return (
        <div className="rounded-xl flex flex-row gap-0 items-start justify-start h-20 relative">
            <div className="rounded-xl flex flex-row gap-0 items-center justify-start flex-1 relative overflow-hidden">
                <div className="p-4 flex flex-row gap-4 items-center justify-start self-stretch flex-1 relative">
                    <div className="shrink-0 w-10 h-10 relative overflow-hidden">
                        <div className="bg-schemes-primary-container rounded-[50%] w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%]"></div>
                        <div
                            className="text-schemes-on-primary-container text-center font-['Roboto-Medium',_sans-serif] text-base leading-6 font-medium absolute left-[50%] top-[50%] w-10 h-10 flex items-center justify-center"
                            style={{ letterSpacing: "0.1px", translate: "-50% -50%" }}
                        >
                            A
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-start flex-1 relative">
                        <div
                            className="text-schemes-on-surface text-left font-m3-title-medium-font-family text-m3-title-medium-font-size leading-m3-title-medium-line-height font-m3-title-medium-font-weight relative self-stretch"
                            style={{ letterSpacing: "var(--m3-title-medium-letter-spacing, 0.15px)" }}
                        >
                            {organisation.name}
                        </div>
                        <div
                            className="text-schemes-on-surface text-left font-m3-body-medium-font-family text-m3-body-medium-font-size leading-m3-body-medium-line-height font-m3-body-medium-font-weight relative self-stretch"
                            style={{ letterSpacing: "var(--m3-body-medium-letter-spacing, 0.25px)" }}
                        >
                            {organisation.description}
                        </div>
                    </div>
                </div>
                <div
                    className="border-solid border-schemes-outline-variant border-t border-r border-b self-stretch shrink-0 w-20 relative"
                >
                    <img
                        className="absolute right-0 left-0 bottom-0 top-0"
                        style={{
                            background:
                                "var(--m3-add-on-placeholder-image, linear-gradient(to left, #ece6f0, #ece6f0))",
                            objectFit: "cover",
                        }}
                        src={organisation.logo}
                    />
                </div>
            </div>
        </div>
    );
};
