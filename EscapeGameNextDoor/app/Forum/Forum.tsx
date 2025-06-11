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
              
            </Box>

        </Paper>
    </>)
}

export default Forum;

