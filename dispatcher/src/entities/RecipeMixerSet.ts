import { MixerUploadType } from "./MixerUploadType";
import { RecipeMixerSetBase } from "./RecipeMixerSetBase";


export interface RecipeMixerSet extends RecipeMixerSetBase
{
    timeDischarge: number;
    timeExtraUnload: number;
    uploadMode: MixerUploadType;
    impulseCount: number;
    impulseTime: number;
    timeBetweenImpulse: number;
    notClose: boolean;
    delay50: number;
    delay75: number;
}
