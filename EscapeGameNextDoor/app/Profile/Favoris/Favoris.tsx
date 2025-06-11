import { Box, Stack } from "@mui/system";
import { ThemedText } from '../../../components/ThemedText';
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import React from 'react';
import { Skeleton } from "@mui/material";
import { useRouter } from "expo-router";
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import { GetSessionGameDto } from '../../../interfaces/EscapeGameInterface/Session/getSessionGameDto';

type Props = {
    item?: GetEscapeGameDto[]; // Replace 'any' with the actual type of the item
};

export default function FavorisComponent(props:Props) {
    const [data, setData] = React.useState<GetEscapeGameDto[] | null | undefined>(props.item || null);
    const rooter = useRouter();

    const HandleRedirection = (item : GetEscapeGameDto) => {
        console.log("Redirecting to favoris details");
        // Implement redirection logic here if needed
        const data= JSON.stringify(item);
         rooter.push({
            pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
            params: { escapeGame: data}
        });
    }
    if(data === null || data === undefined || data.length === 0)  {
        return (
            <Stack>
                <Box >
                     <Skeleton />
                </Box>
            </Stack>
        );
    }
    else
    {
        return (
            <Stack>
          <Box>
            {data.map((item, index) => (
              <React.Fragment key={item.esgId|| index}>
                <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: index !== data.length - 1 ? 2 : 0,
              p: 1,
              border: '1px solid #eee',
              borderRadius: 2,
              cursor: 'pointer',
            }}
            onClick={() => HandleRedirection(item)}
                >
            <Box sx={{ flexBasis: 120, flexShrink: 0 }}>
              <img
                src={item.esgImgResources || '/placeholder.png'}
                alt={item.esgNom}
                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: 'bold' }}>{item.esgNom}</ThemedText>
              <ThemedText style={{ fontSize: 14, color: '#666' }}>
                {item.esgContent}
              </ThemedText>
            </Box>
                </Box>
              </React.Fragment>
            ))}
          </Box>
            </Stack>
        )

    }
}

type PropsItem = {
    item: GetEscapeGameDto; // Replace 'any' with the actual type of the item
};

