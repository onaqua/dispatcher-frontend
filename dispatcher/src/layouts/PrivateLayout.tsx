import {
    Button,
    Dropdown,
    Layout,
    Menu,
    MenuProps,
    Result,
    Row,
    Spin,
    message,
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useState } from "react";
import { GoLog, GoMoon, GoStack, GoSun } from "react-icons/go";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DispatcherTour } from "../components/DispatcherTour";
import { UserAccountDropdownMenu } from "../components/UserAccount";
import UserStateDTO from "../entities/UserStateDTO";
import { AuthorizationService } from "../services/AuthorizationService";
import { ApiError } from "../services/core/ApiError";
import { setTheme } from "../store/reducers/themeSlice";
import { setUser } from "../store/reducers/userSlice";
import { RootState } from "../store/store";
import { SocketLayout } from "./SocketLayout";

export type PrivateLayoutProps = {
    element: React.ReactNode;
};

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ element }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userState = useSelector((state: RootState) => state.user.currentUser);
    const [isTourOpen, setTourOpen] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState("panel");

    const items: MenuProps["items"] = [
        {
            key: "light",
            label: <a target="_blank">Светлая</a>,
            onClick: () => dispatch(setTheme("light")),
        },
        {
            key: "dark",
            label: <a target="_blank">Темная</a>,
            onClick: () => dispatch(setTheme("dark")),
        },
    ];

    const themeIcon =
        localStorage.getItem("theme") === "dark" ? <GoSun /> : <GoMoon />;

    const handleThemeChange = () => {
        dispatch(
            setTheme(
                localStorage.getItem("theme") === "dark" ? "light" : "dark"
            )
        );
    };

    const {
        isError: isUserStateErrorLoaded,
        isLoading: isUserStateLoading,
        isSuccess: isUserStateSuccessLoaded,
    } = useQuery<UserStateDTO, ApiError>(
        "getState",
        () => AuthorizationService.GetStateAsync(),
        {
            onSuccess(data) {
                dispatch(setUser(data));
            },
            onError() {
                navigate("/login");
            },
            retry: false,
            retryOnMount: true,
            refetchOnMount: true,
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

    const changePageHandler: MenuProps["onClick"] = (e) => {
        setCurrentPage(e.key);
    };

    if (isUserStateSuccessLoaded) {
        return (
            <>
                <Layout className="w-full h-dvh">
                    <Header className="m-0 p-0 bg-white dark:bg-slate-900">
                        <Row>
                            <Menu
                                selectedKeys={[currentPage]}
                                onClick={changePageHandler}
                                mode="horizontal"
                                className=" w-full"
                                items={[
                                    {
                                        label: (
                                            <Link to={"/"}>
                                                Панель управления
                                            </Link>
                                        ),
                                        key: "panel",
                                        icon: <GoStack />,
                                    },
                                    {
                                        label: (
                                            <Link to={"/events-logs"}>
                                                Журнал событий
                                            </Link>
                                        ),
                                        key: "events-logs",
                                        icon: <GoLog />,
                                    },
                                ]}
                                theme={
                                    localStorage.getItem("theme") === "light"
                                        ? "light"
                                        : "dark"
                                }
                            ></Menu>

                            <div className="cursor-pointer p-4 absolute right-8 flex items-center justify-center space-x-3">
                                <Dropdown menu={{ items }}>
                                    <Button
                                        onClick={handleThemeChange}
                                        className="justify-center items-center flex"
                                        icon={themeIcon}
                                    ></Button>
                                </Dropdown>
                                <UserAccountDropdownMenu
                                    username={`${userState?.firstName} ${userState?.lastName}`}
                                    onSignOut={handleSignOutAsync}
                                />
                            </div>
                        </Row>
                    </Header>

                    <div className=" overflow-hidden h-dvh w-full dark:bg-slate-900 bg-slate-50 dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex justify-center">
                        <div className="h-full absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-slate-900 bg-slate-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

                        <Layout className="bg-transparent w-full overflow-x-hidden">
                            <SocketLayout element={element} />
                        </Layout>
                    </div>

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
                    className="bg-transparent"
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
