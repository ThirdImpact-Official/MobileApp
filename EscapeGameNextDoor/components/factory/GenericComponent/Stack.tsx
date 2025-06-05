import Item from "./Item";
import { Divider, Stack } from '@mui/material';

interface StacksProps
{
    direction:string;
    
    children: React.ReactNode[]
}

export default function Stacks({ children }: StacksProps) 
{
    return (
        <div>
            <Stack direction={"row"} spacing={2}
            divider={
                <Divider
                    orientation="vertical"
                    flexItem/>
            }>
            {children.map((child, index) => (
                <>
                    <Item key={index}>{child}</Item>
                </>
            ))}
            </Stack>
        </div>
    );

}