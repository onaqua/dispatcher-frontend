import { Avatar, Dropdown, MenuProps, Typography } from "antd";

export type UserAccountDropdownMenuProps = {
    username: string;
    email?: string;
    avatarUrl?: string;

    onSignOut(): Promise<void>;
};

/** Компонент с иконкой пользователя имеет
 *  меню и функции для выхода из аккаунта */
export const UserAccountDropdownMenu: React.FC<UserAccountDropdownMenuProps> = ({
    username,
    avatarUrl,
    onSignOut,
}) => {
    const items: MenuProps["items"] = [
        {
            key: "2",
            danger: true,
            label: <a target="_blank">Выйти из аккаунта</a>,
            onClick: onSignOut,
        },
    ];

    return (
        <Dropdown menu={{ items }} placement="bottomLeft">
            <div className="flex items-center space-x-3">
                <Avatar src={avatarUrl} shape="square" className=" bg-blue-600">
                    {username.charAt(0)}
                </Avatar>

                <Typography.Text>{username}</Typography.Text>
            </div>
        </Dropdown>
    );
};

export default UserAccountDropdownMenu;
