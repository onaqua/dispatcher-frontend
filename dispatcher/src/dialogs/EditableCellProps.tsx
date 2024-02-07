import React from "react";
import { CarItem } from "./CarsDialogs";


export interface EditableCellProps extends React.HTMLAttributes<HTMLElement>
{
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "number" | "text";
    record: CarItem;
    index: number;
    children: React.ReactNode;
    autoFocus: boolean;
}
