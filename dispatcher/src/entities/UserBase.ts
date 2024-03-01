import { BaseInfo } from "./BaseInfo";
import { PermissionLevel } from "./PermissionLevel";


export interface UserBase extends BaseInfo
{
    perms: PermissionLevel;
}
