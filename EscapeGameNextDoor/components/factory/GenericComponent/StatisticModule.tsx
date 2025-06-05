import { FC, useState, useEffect } from "react";
import { StackedLineChart } from "@mui/icons-material";
import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import{ ChartContainer,
        lineElementClasses,
        markElementClasses,
        LinePlot,
        MarkPlot,
        LineChart } from "@mui/x-charts";
interface LineChartProps {
    title: string;
    data: number[];
    labels: string[];
}
const  LineChartState:FC<LineChartProps> =(props)=> {

    const [value,setValue] = useState<number[]>(props.data);
    
    return(<>
        <Card>
            <CardHeader title={props.title}  />
            <CardContent>
               <ChartContainer 
                    series={
                        [
                            {
                                type: "line",
                                label: 'Data',
                                data: value,
                            },
                        ]
                    }
                    width={600}
                    height={400}
                    sx={{
                        [`& .${lineElementClasses.root}`]: {
                          stroke: '#8884d8',
                          strokeWidth: 2,
                        },
                        [`& .${markElementClasses.root}`]: {
                          stroke: '#8884d8',
                          r: 4, // Modify the circle radius
                          fill: '#fff',
                          strokeWidth: 2,
                        },
                      }}
                >
                    <LinePlot />
                    <MarkPlot />
                </ChartContainer>
            </CardContent>
            <CardActions>

            </CardActions>
        </Card>
    </>)
}
export default LineChartState;