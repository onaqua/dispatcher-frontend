import {
    HubConnectionBuilder,
    IRetryPolicy,
    RetryContext,
} from "@microsoft/signalr";
import { Button, Card, Result, Spin, Typography, message } from "antd";
import Layout, { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { ProductionApplicationDTO } from "../entities/ApplicationDTO";
import { ApplicationInQueueAdded as ApplicationInQueueUpdated } from "../entities/notifications/ApplicationInQueueAdded";
import { ApplicationStateUpdated as ApplicationStateUpdatedNotification } from "../entities/notifications/ApplicationStateUpdated";
import { ApplicationsOrderUpdated } from "../entities/notifications/ApplicationsOrderUpdated";
import {
    ApplicationsService,
    ConnectionsService,
} from "../services/AuthorizationService";
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

export type SocketLayoutProps = {
    element: React.ReactNode;
};

class ConnectionRetryPolicy implements IRetryPolicy {
    nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
        return 1000;
    }
}

export const SocketLayout: React.FC<SocketLayoutProps> = ({ element }) => {
    const dispatch = useDispatch();
    const [isConnected, setIsConnected] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);

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
                message.success(`Заявка ${application.id} успешно создана`);
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
        <Spin
            spinning={
                isApplicationsInQueueLoading ||
                isApplicationsPreQueueLoading ||
                isConnecting
            }
        >
            <Layout className=" w-full h-full bg-slate-50">
                {isConnected && (
                    <Content className=" w-full h-full">{element}</Content>
                )}

                {!isConnected && (
                    <Content className=" ">
                        <Card className="z-50 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Spin spinning={isPingLoading}>
                                <Result
                                    status="error"
                                    title="Нет связи с производством"
                                    subTitle="Проверьте подключение к интернету на устройстве, где расположена программа SmartMix."
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
                            </Spin>
                        </Card>
                        <Content className=" pointer-events-none opacity-15">
                            {element}
                        </Content>
                    </Content>
                )}
            </Layout>
        </Spin>
    );
};
