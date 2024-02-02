import { DefaultOptionType } from "antd/es/select";


export interface TypedOption<T> extends DefaultOptionType
{
    value: string | number;
    label: string;
    data: T;
}
