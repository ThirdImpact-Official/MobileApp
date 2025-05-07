export interface DetailsProps<T> {
    data: T;
    cols: {label:string; accessor: keyof T}[];
}