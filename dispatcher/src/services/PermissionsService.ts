import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export class PermissionsService {
    static hasPermission(permission: string): boolean {
        const userState = useSelector((root: RootState) => root.user);

        if (!userState.currentUser) {
            return false;
        }

        return userState.currentUser.roles.includes(permission);
    }
}
