import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FC, useState } from "react";


interface SelectGenericProps<T> {
    data:T[];
    columns:{label:string ; accessor: keyof T}[];
    OnChange:(data: T)=>void
}
const SelectGeneric = <T extends { id: number }>({
  data,
  columns,
  OnChange,
}: SelectGenericProps<T>) => {
  const [selectedItemId, setSelectedItemId] = useState<number >(data[0].id);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selected = event.target.value;
    setSelectedItemId(selected as number);

    const selectedData = data.find((item) => item.id === selected);
    if (selectedData) {
      OnChange(selectedData);
    }
  };

  return (
    <Select value={selectedItemId} onChange={handleChange}>
      {data.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {columns.map((col) => item[col.accessor]).join(", ")}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectGeneric;
