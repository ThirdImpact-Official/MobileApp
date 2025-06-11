import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import { GetForumDto } from '@/interfaces/PublicationInterface/Forum/getForumDto';
import { UnitofAction } from '@/action/UnitofAction';
import { useEffect } from 'react';
import { CardActionArea, Pagination, Skeleton } from '@mui/material';



export default function ListStackRatio() {
    const [data,setData] = React.useState<GetForumDto[]>();
    const [page,setPage] = React.useState<number>(1);

    const action = new UnitofAction();


    const Fetchforum= async ()=> {
        const response = await action.forumAction.getAllForums(1,5);
        if(response.Success)
        {
            setData(response.Data as GetForumDto[]);
        }

    }
    useEffect(()=> {
        Fetchforum();
    },[page]);
    if(data === undefined)
    {
        return (
            <Card variant="outlined" sx={{ width: 300, p: 0 }}>
              <List sx={{ py: 'var(--ListDivider-gap)' }}>
                <ListItem>
                  <ListItemButton sx={{ gap: 2 }}>
                    <AspectRatio sx={{ flexBasis: 120 }}>
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    </AspectRatio>
                    <ListItemContent>
                      <Skeleton width="60%" />
                      <Skeleton width="60%" />
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                   <ListItem>
                  <ListItemButton sx={{ gap: 2 }}>
                    <AspectRatio sx={{ flexBasis: 120 }}>
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    </AspectRatio>
                    <ListItemContent>
                      <Skeleton width="60%" />
                      <Skeleton width="60%" />
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                   <ListItem>
                  <ListItemButton sx={{ gap: 2 }}>
                    <AspectRatio sx={{ flexBasis: 120 }}>
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    </AspectRatio>
                    <ListItemContent>
                      <Skeleton width="60%" />
                      <Skeleton width="60%" />
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
            </Card>
          );
    }
    else{
        return (
        <Card variant="outlined" sx={{ width: 300, p: 0 }}>
          <List sx={{ py: 'var(--ListDivider-gap)' }}>
            {data.map((item, index) => (
              <React.Fragment key={item.title}>
                <ListItem>
                  <ListItemButton sx={{ gap: 2 }}>
                    <AspectRatio sx={{ flexBasis: 120 }}>
                    </AspectRatio>
                    <ListItemContent>
                      <Typography sx={{ fontWeight: 'md' }}>{item.title}</Typography>
                      <Typography level="body-sm">{item.content}</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                {index !== data.length - 1 && <ListDivider />}
              </React.Fragment>
            ))}
          </List>
          <CardActionArea>
            <Pagination count={10} page={page} onChange={(event, value) => setPage(value)} />
          </CardActionArea>
        </Card>
      );
        
    }
}