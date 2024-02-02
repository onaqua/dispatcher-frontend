import {
    HubConnectionBuilder,
    IRetryPolicy,
    RetryContext,
} from "@microsoft/signalr";
import { Button, Card, Result, Space, Spin, message } from "antd";
import Layout, { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import UseAnimations from "react-useanimations";
import alertCircle from "react-useanimations/lib/alertCircle";
import ApplicationStatus, {
    ProductionApplicationDTO,
} from "../entities/ApplicationDTO";
import { ApplicationInQueueAdded as ApplicationInQueueUpdated } from "../entities/notifications/ApplicationInQueueAdded";
import { ApplicationStateUpdated as ApplicationStateUpdatedNotification } from "../entities/notifications/ApplicationStateUpdated";
import { ApplicationsOrderUpdated } from "../entities/notifications/ApplicationsOrderUpdated";
import { ConnectionsService } from "../services/ConnectionsService";
import { ApplicationsService } from "../services/ApplicationsService";
import { ApiError } from "../services/core/ApiError";
import {
    addApplicationInPreQueue,
    removeApplicationInPreQueue,
    setApplicationsInPreQueue,
    updateOrderInPreQueue,
} from "../store/reducers/applicationsInPreQueueSlice";
import {
    addApplicationInQueue,
    removeApplicationInQueue,
    setApplicationsInQueue,
    updateApplicationInQueue,
    updateOrderInQueue,
} from "../store/reducers/applicationsInQueueSlice";
import { RootState } from "../store/store";
import { setApplication } from "../store/reducers/dispatcherSlice";

export type SocketLayoutProps = {
    element: React.ReactNode;
};

class ConnectionRetryPolicy implements IRetryPolicy {
    nextRetryDelayInMilliseconds(): number | null {
        return 1000;
    }
}

export const SocketLayout: React.FC<SocketLayoutProps> = ({ element }) => {
    const dispatch = useDispatch();
    const [isConnected, setIsConnected] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);

    const dialogApplication = useSelector(
        (state: RootState) => state.dispatcher.application
    );

    const {
        isLoading: isApplicationsInQueueLoading,
        mutateAsync: getApplicationsInQueue,
    } = useMutation<Array<ProductionApplicationDTO>, ApiError>(
        () => ApplicationsService.GetAllInQueueAsync(),
        {
            onSuccess(data) {
                dispatch(setApplicationsInQueue(data));
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const {
        isLoading: isApplicationsPreQueueLoading,
        mutateAsync: getApplicationsInPreQueue,
    } = useMutation<Array<ProductionApplicationDTO>, ApiError>(
        () => ApplicationsService.GetAllInPreQueueAsync(),
        {
            onSuccess(data) {
                dispatch(setApplicationsInPreQueue(data));
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const { mutateAsync: setApplicationInQueueAsync } = useMutation<
        ProductionApplicationDTO,
        ApiError,
        number
    >((id) => ApplicationsService.GetInQueueAsync(id), {
        onSuccess(application) {
            if (application.isDeleted) {
                dispatch(removeApplicationInQueue(application.id));
            } else {
                dispatch(addApplicationInQueue(application));
            }
        },
        onError(error) {
            message.error(error.body.Details);
        },
    });

    const { mutateAsync: updateApplicationInQueueAsync } = useMutation<
        ProductionApplicationDTO,
        ApiError,
        number
    >((id) => ApplicationsService.GetInQueueAsync(id), {
        onSuccess(application) {
            dispatch(updateApplicationInQueue(application));

            if (application.id === dialogApplication?.id) {
                dispatch(setApplication(application));
            }
        },
        onError(error) {
            message.error(error.body.Details);
        },
    });

    const { mutateAsync: updateApplicationInPreQueueAsync } = useMutation<
        ProductionApplicationDTO,
        ApiError,
        number
    >((id) => ApplicationsService.GetInPreQueueAsync(id), {
        onSuccess(application) {
            if (application.isDeleted) {
                dispatch(removeApplicationInPreQueue(application.id));
            } else {
                dispatch(addApplicationInPreQueue(application));
            }
        },
        onError(error) {
            message.error(error.body.Details);
        },
    });

    const { isLoading: isPingLoading, mutateAsync: pingAsync } = useMutation<
        void,
        ApiError
    >(
        async () => {
            message.loading(
                "Проверяем подключение к вашему производству...",
                0.8
            );

            var ping = await ConnectionsService.CheckAsync();

            return ping;
        },
        {
            onError: () => {
                message.error(
                    "Нам не удалось достучаться до вашего производства, повторите запрос позже..."
                );
                setIsConnected(false);
            },
            onSuccess: () => setIsConnected(true),
        }
    );

    async function OnApplicationInQueueStateChanged(
        notificaiton: ApplicationStateUpdatedNotification
    ): Promise<void> {
        console.log("Id:", notificaiton.applicationId);

        if (notificaiton.applicationId != -1) {
            await updateApplicationInQueueAsync(notificaiton.applicationId);
        }
    }

    async function OnApplicationInQueueUpdated(
        notificaiton: ApplicationInQueueUpdated
    ): Promise<void> {
        if (notificaiton.applicationId != -1) {
            await setApplicationInQueueAsync(notificaiton.applicationId);
        }
    }

    async function OnRetryConnectHandle(): Promise<void> {
        await pingAsync().then(async () => {
            await getApplicationsInQueue();
            await getApplicationsInPreQueue();
        });
    }

    async function OnApplicationInPreQueueUpdated(
        notificaiton: ApplicationInQueueUpdated
    ): Promise<void> {
        if (notificaiton.applicationId != -1) {
            await updateApplicationInPreQueueAsync(notificaiton.applicationId);
        } else {
            console.log("applicationId: -1", notificaiton);
        }
    }

    function OnApplicationInQueueOrderUpdated(
        notificaiton: ApplicationsOrderUpdated
    ): void {
        dispatch(updateOrderInQueue(notificaiton.applicationsOrder));
    }

    function OnApplicationInPreQueueOrderUpdated(
        notificaiton: ApplicationsOrderUpdated
    ): void {
        dispatch(updateOrderInPreQueue(notificaiton.applicationsOrder));
    }

    useEffect(() => {
        async function connectAsync() {
            setIsConnecting(true);

            const connection = new HubConnectionBuilder()
                .withUrl(`http://localhost:6100/signalr/notifications-hub`)
                .withAutomaticReconnect(new ConnectionRetryPolicy())
                .build();

            connection.on("NotifyProductionDisconnected", () => {
                setIsConnected(false);
                message.error("Производство отключено");
            });

            connection.on("NotifyProductionConnected", () => {
                setIsConnected(true);
                message.success("Производство успешно подключено");
            });

            connection.on(
                "ApplicationsInQueueOrderUpdated",
                OnApplicationInQueueOrderUpdated
            );

            connection.on(
                "ApplicationsInPreQueueOrderUpdated",
                OnApplicationInPreQueueOrderUpdated
            );

            connection.on(
                "ApplicationInQueueStateUpdated",
                OnApplicationInQueueStateChanged
            );

            connection.on(
                "ApplicationInPreQueueUpdated",
                OnApplicationInPreQueueUpdated
            );

            connection.on(
                "ApplicationInQueueUpdated",
                OnApplicationInQueueUpdated
            );

            connection.onreconnected(() => {
                setIsConnecting(false);
                setIsConnected(true);

                message.success(
                    "Вы были успешно переподключены к сети SmartWeb"
                );
            });

            connection.onclose(() => {
                setIsConnecting(true);
                setIsConnected(false);

                message.error(
                    "Вы были отключены от сети SmartWeb. Попробуйте переподключиться"
                );
            });

            connection.onreconnecting(() => {
                setIsConnecting(true);
                setIsConnected(false);

                message.loading("Выполняется переподключение к сети SmartWeb");
            });

            await connection
                .start()
                .then(async () => {
                    setIsConnecting(false);
                    setIsConnected(true);

                    await pingAsync();
                    await getApplicationsInQueue();
                    await getApplicationsInPreQueue();
                })
                .catch(() => {
                    setIsConnecting(false);
                    setIsConnected(false);
                });
        }

        connectAsync();
    }, []);

    return (
        <Layout className=" w-full bg-slate-50 p-4">
            <Spin
                spinning={
                    isApplicationsInQueueLoading ||
                    isApplicationsPreQueueLoading ||
                    isConnecting
                }
            >
                {isConnected && (
                    <Content className=" w-full min-h-screen">{element}</Content>
                )}

                {!isConnected && (
                    <div className=" items-center justify-center h-full w-full">
                        <Card bordered={true} className=" h-full w-full">
                            <Result
                                status="500"
                                title="Хьюстон, у нас проблемы..."
                                subTitle={`
                                        Ваше производство скоро переподключится, но если вы не верите, то можете потыкать на кнопку ниже.
                                        Если проблема долго не исчезает, то вам необходимо проверить интернет подключение на компьютере, где расположена программа SmartMix.`}
                                extra={
                                    <Button
                                        type="primary"
                                        onClick={OnRetryConnectHandle}
                                        disabled={isPingLoading}
                                    >
                                        Проверить подключение
                                    </Button>
                                }
                            />
                        </Card>
                    </div>
                )}
            </Spin>
        </Layout>
    );
};
