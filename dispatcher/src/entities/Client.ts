import { BaseInfo } from "./BaseInfo";
import { UnloadingPoint } from "./UnloadingPoint";


export interface Client extends BaseInfo
{
    address?: string;
    fullName?: string;
    iNN?: string;
    bank?: string;
    bIK?: string;
    kPP?: string;
    paymentAccount?: string;
    correspondentAccount?: string;
    phone?: string;
    description?: string;
    unloadingPoints?: UnloadingPoint[];
    selectionUnloadingPoints?: number;
}
