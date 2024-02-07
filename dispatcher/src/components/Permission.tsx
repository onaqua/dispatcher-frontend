import { Tooltip, Typography } from "antd";
import { PermissionsService } from "../services/PermissionsService";

export type PermissionsProps = {
    need: string;
    children: React.ReactNode;
    forbiddenText?: string;
};

export const Permission: React.FC<PermissionsProps> = ({
    need: permission,
    children,
    forbiddenText,
}) => {
    if (PermissionsService.hasPermission(permission)) {
        return children;
    }

    if (forbiddenText) {
        return (
            <Tooltip title="У вас нет доступа для просмотра данного контента. Вы можете попросить повышение прав доступа у вашего руководителя.">
                <Typography.Text>{forbiddenText}</Typography.Text>
            </Tooltip>
        );
    }
};
