import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Layout,
    Menu,
    MenuProps,
    Result,
    Row,
    Spin,
    message,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import MenuItem from "antd/es/menu/MenuItem";
import { useEffect, useState } from "react";
import { CiGrid32, CiMemoPad } from "react-icons/ci";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DispatcherTour } from "../components/DispatcherTour";
import { UserAccountDropdownMenu } from "../components/UserAccount";
import UserStateDTO from "../entities/UserStateDTO";
import { AuthorizationService } from "../services/AuthorizationService";
import { ApiError } from "../services/core/ApiError";
import { setUser } from "../store/reducers/userSlice";
import { RootState } from "../store/store";
import { SocketLayout } from "./SocketLayout";

export type PrivateLayoutProps = {
    element: React.ReactNode;
};

type MenuItem = Required<MenuProps>["items"][number];

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ element }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userState = useSelector((state: RootState) => state.user.currentUser);
    const [isTourOpen, setTourOpen] = useState<boolean>(false);
    const [isMenuToggled, setMenuToggled] = useState<boolean>(false);

    const items: MenuItem[] = [
        {
            label: <Link to={"/"}>Диспетчер</Link>,
            key: "dispatcher",
            icon: <CiGrid32 />,
        },
        {
            label: <Link to={"/events-logs"}>Журнал событий</Link>,
            key: "events",
            icon: <CiMemoPad />,
        },
    ];

    const {
        mutateAsync: getUserStateAsync,
        isError: isUserStateErrorLoaded,
        isLoading: isUserStateLoading,
        isSuccess: isUserStateSuccessLoaded,
    } = useMutation<UserStateDTO, ApiError>(
        () => AuthorizationService.GetStateAsync(),
        {
            onSuccess(data) {
                dispatch(setUser(data));
            },
            onError() {
                navigate("/login");
            },
        }
    );

    const { mutateAsync: signOutAsync } = useMutation<void, ApiError>(
        () => AuthorizationService.SignOutAsync(),
        {
            onSuccess() {
                navigate("/login");
                dispatch(setUser(undefined));
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const handleSignOutAsync = async () => {
        await signOutAsync();
    };

    const handleTourOpen = () => {
        setTourOpen(true);
    };

    const handleToggleMenu = () => {
        setMenuToggled(!isMenuToggled);
    };

    useEffect(() => {
        getUserStateAsync();
    }, []);

    if (isUserStateSuccessLoaded) {
        return (
            <>
                <Layout className=" w-full bg-slate-50 h-dvh-100vh">
                    <Header className=" bg-white">
                        <Row>
                            <Col xs={0} xl={21}>
                                <Button
                                    type="primary"
                                    onClick={handleToggleMenu}
                                >
                                    {isMenuToggled ? (
                                        <MenuUnfoldOutlined />
                                    ) : (
                                        <MenuFoldOutlined />
                                    )}
                                </Button>
                            </Col>

                            <Col xs={24} xl={3} className="p-4">
                                <div className="cursor-pointer">
                                    <UserAccountDropdownMenu
                                        username={`${userState?.firstName} ${userState?.lastName}`}
                                        onSignOut={handleSignOutAsync}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Header>

                    <Layout className=" h-dvh bg-slate-50">
                        <Sider
                            collapsed={isMenuToggled}
                            className=" h-full w-full"
                        >
                            <Menu
                                inlineCollapsed={isMenuToggled}
                                className=" h-full p-2"
                                defaultSelectedKeys={["dispatcher"]}
                                defaultOpenKeys={["dispatcher"]}
                                mode="inline"
                                items={items}
                                theme="light"
                            />
                        </Sider>
                        <SocketLayout element={element} />
                    </Layout>

                    <DispatcherTour
                        isOpen={isTourOpen}
                        onClose={() => setTourOpen(false)}
                    />
                </Layout>
            </>
        );
    }

    if (isUserStateLoading) {
        return (
            <Content className="flex justify-center items-center">
                <Result
                    icon={<Spin spinning={isUserStateLoading} />}
                    status={"info"}
                    title="Загрузка"
                    subTitle="Пожалуйста, подождите, выполняется проверка пользователя"
                ></Result>
            </Content>
        );
    }

    if (isUserStateErrorLoaded) {
        return <Navigate to="/login" />;
    }
};
