import { UnitofAction } from "@/action/UnitofAction";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { GetForumDto } from "@/interfaces/PublicationInterface/Forum/getForumDto";
import { Skeleton, Stack , Paper, Box ,Typography, FormControl } from "@mui/material";
import { FC ,useEffect,useState } from "react";
import renderer from 'react-test-renderer';

const Forum = () => {
    
    const [forum, setForum] = useState<GetForumDto[] | null>(null);
    const action = new UnitofAction();
    const [page,setPage] = useState<number>(1);
    const notif = useToasted();
    /**
     * 
     * @returns
     */
    const fetchForum = async () => {
        try {
            const response = await action.forumAction.getAllForums(page,5);
            
            if(response.Success) 
            {
                setForum(response.Data as GetForumDto[]);
                notif.isvisible=true;
                notif.showToast(response.Message,"success");
            }   
            else{
                notif.isvisible=true;
                notif.showToast(response.Message,"error");
            }  
        }   
        catch (error) {
            console.error(error);
        } 
    };

    useEffect(() => {
        fetchForum();
    },[page]);

    return (<>
        <Paper elevation={2}>
            <Typography variant="h3" gutterBottom component="div">
                Forum
            </Typography>
            <Box>
                <FormControl>

                </FormControl>
                <FormControl>

                </FormControl>
            </Box>
            <Box>
                <ForumList data={forum as GetForumDto[]}></ForumList>
            </Box>

        </Paper>
    </>)
}

export default Forum;
//--------------------------------
// -----------------------LIST----
//--------------------------------
/**
 * 
 */
interface ForumListProps {
    data: GetForumDto[]
}

const ForumList :FC<ForumListProps> = (props) => { 
    const [dataList,setDataList] = useState<GetForumDto[] | null >(props.data);
    
    if(dataList) {
        return (
            <>
              <Stack>
                { dataList.map((column) => (<ForumItem key={column.id} data={column} />))}
            </Stack>
            </>
        )
    }
    else {
        return (<>
            <Stack>
            { <Skeleton></Skeleton>}
            </Stack>
        </>)
    }
}

//------------------------ITEM----
//------------------------ITEM----
//------------------------
interface ForumItemProps {
    data : GetForumDto
}
const ForumItem: FC<ForumItemProps> = ({ data: forum }) => {
  return (
    <div className="rounded-xl flex flex-row gap-0 items-start justify-start h-20 relative">
      <div className="rounded-xl flex flex-row gap-0 items-center justify-start flex-1 relative overflow-hidden">
        <div className="p-4 flex flex-row gap-4 items-center justify-start self-stretch flex-1 relative">
          <div className="shrink-0 w-10 h-10 relative overflow-hidden">
            <div className="bg-schemes-primary-container rounded-[50%] w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%]" />
            <div className="text-schemes-on-primary-container text-center font-['Roboto-Medium',_sans-serif] text-base leading-6 font-medium absolute left-[50%] top-[50%] w-10 h-10 flex items-center justify-center" style={{ letterSpacing: "0.1px", translate: "-50% -50%" }}>
              A
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start justify-start flex-1 relative">
            <div className="text-schemes-on-surface text-left font-m3-title-medium-font-family text-m3-title-medium-font-size leading-m3-title-medium-line-height font-m3-title-medium-font-weight relative self-stretch" style={{ letterSpacing: "var(--m3-title-medium-letter-spacing, 0.15px)" }}>
              {forum.title}
            </div>
            <div className="text-schemes-on-surface text-left font-m3-body-medium-font-family text-m3-body-medium-font-size leading-m3-body-medium-line-height font-m3-body-medium-font-weight relative self-stretch" style={{ letterSpacing: "var(--m3-body-medium-letter-spacing, 0.25px)" }}>
              {forum.content}
            </div>
          </div>
        </div>
        <div className="border-solid border-schemes-outline-variant border-t border-r border-b self-stretch shrink-0 w-20 relative">
          <img className="absolute right-0 left-0 bottom-0 top-0" style={{ background: "var(--m3-add-on-placeholder-image, linear-gradient(to left, #ece6f0, #ece6f0))", objectFit: "cover" }} src="media1.png" />
        </div>
      </div>
      <div className="bg-schemes-surface rounded-xl border-solid border-schemes-outline-variant border shrink-0 w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%] overflow-hidden">
        <div className="p-2.5 flex flex-col gap-2.5 items-center justify-center w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%]" />
      </div>
    </div>
  );
};
