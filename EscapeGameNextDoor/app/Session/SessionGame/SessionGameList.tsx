import React from 'react';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';

import { GetSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/getSessionGameDto';
type Props ={
    item: GetSessionGameDto[];
}

export default function SessionGameList(props: Props){

    return(
        <>
            <div>
                {props.item.map((session,index)=>(

                    <SessionGameItem key={index} item={session}  />
                ))}
            </div>
        </>
    );
}

type PropsItem={
item: GetSessionGameDto;
}
export function SessionGameItem({ item }: PropsItem) {
  return (
    <ItemDisplay
      letter={item.escapeGameId.toString()}
      name={item.isReserved ? 'Reserved' : 'Available'}
      header={"Session"+item.gameDate.toLocaleDateString()}
    
    />
  );
}
