import { BaseInfo } from "./BaseInfo";


export interface RecipeMixerSetBase extends BaseInfo
{
    lineNumber: number;
    isUsed: boolean;
    mixerNumber: number;
}
