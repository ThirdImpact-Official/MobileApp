import { GetActivityPlaceDto } from '../../../interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto';
import { Stack, Box, Skeleton } from '@mui/material';
import { ThemedText } from '@/components/ThemedText';
import { useState,FC } from 'react';
import { testActivityPlaces } from '@/TestData/ActivityPlacetestData';
import AppView from '@/components/ui/AppView';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { useRouter } from 'expo-router';

/**
 * 
 * @returns 
 */
const ActivityPlaceList = () => {
    const [dataTable, setDataTable] = useState<GetActivityPlaceDto[]>(testActivityPlaces);
    return (
        <AppView>

        <Stack>
            <Box>
                <ThemedText>ActivityPlace</ThemedText>
            </Box>
            <Box>
                {
                    dataTable.map((column) => (<ActivityPlaceItem key={column.acpEsgId} data={column} />))
                }
            </Box>
        </Stack>
        </AppView>
    )
}

export default ActivityPlaceList;

interface ActivityPlaceListProps {
    data?: GetActivityPlaceDto | undefined| null;
}
/**
 * ActivityPlaceItem
 */
const ActivityPlaceItem: FC<ActivityPlaceListProps> = ({ data }) => {
    const router = useRouter();

    if (!data) {
        return (
            <Stack>
                <div className="rounded-xl flex flex-row items-start h-20 relative">
                    <div className="rounded-xl flex flex-row items-center flex-1 overflow-hidden">
                        <div className="p-4 flex flex-row items-center flex-1">
                            <div className="w-10 h-10 relative overflow-hidden">
                                <div className="bg-schemes-primary-container rounded-full w-full h-full absolute" />
                                <div className="text-schemes-on-primary-container text-center font-medium text-base leading-6 absolute left-1/2 top-1/2 w-10 h-10 flex items-center justify-center" style={{ transform: 'translate(-50%, -50%)' }}>
                                    <Skeleton />
                                </div>
                            </div>
                            <div className="flex flex-col items-start flex-1">
                                <div className="text-schemes-on-surface text-left font-m3-title-medium relative">
                                    <Skeleton />
                                </div>
                            </div>
                        </div>
                        <div className="border-solid border-schemes-outline-variant border-t border-r border-b w-20 relative">
                            <Skeleton className="absolute inset-0" />
                        </div>
                    </div>
                </div>
            </Stack>
        );
    }

    return (
        <Stack>
            <Box>
                <ItemDisplay
                    header={data.name}
                    letter={data.acpEsgId.toString()}
                    name={data.address}
                    img={data.imgressources}
                    onClick={() =>
                        router.push({
                            pathname: `/Organisation/ActivitityPlace/ActivityPlaceDetail`,
                            params: { id: data.acpId },
                        })
                    }
                />
            </Box>
        </Stack>
    );
};
