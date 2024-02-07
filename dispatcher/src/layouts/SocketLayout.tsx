import { HubConnectionBuilder, IRetryPolicy } from "@microsoft/signalr";
import { Button, Card, Result, message } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ProductionApplicationDTO } from "../entities/ApplicationDTO";
import { ApplicationInQueueAdded as ApplicationInQueueUpdated } from "../entities/notifications/ApplicationInQueueAdded";
import { ApplicationStateUpdated as ApplicationStateUpdatedNotification } from "../entities/notifications/ApplicationStateUpdated";
import { ApplicationsOrderUpdated } from "../entities/notifications/ApplicationsOrderUpdated";
import { ApplicationsService } from "../services/ApplicationsService";
import { ConnectionsService } from "../services/ConnectionsService";
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
import { setApplication } from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";
import { WavyBackground } from "../components/WavyBackground";

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
    const [isConnected, setIsConnected] = useState(false);

    const dialogApplication = useSelector(
        (state: RootState) => state.dispatcher.application
    );

    const {
        isLoading: isApplicationsInQueueLoading,
        isSuccess: isApplicationsInQueueLoadedSuccess,
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
        isSuccess: isApplicationsInPreQueueLoadedSuccess,
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

    const {
        isLoading: isCheckingProductionConnectionLoading,
        mutateAsync: checkProductionConnection,
    } = useMutation<void, ApiError>(
        async () => {
            message.loading(
                "Проверяем подключение к вашему производству...",
                0.8
            );

            await ConnectionsService.CheckAsync();
        },
        {
            onError: () => {
                message.error(
                    "Нам не удалось достучаться до вашего производства, повторите запрос позже..."
                );

                setIsConnected(false);
            },
            onSuccess: () => {
                message.success(
                    "Подключение к вашему производству установлено!"
                );

                setIsConnected(true);
            },
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

    async function reloadProductionData(): Promise<void> {
        await getApplicationsInQueue();
        await getApplicationsInPreQueue();
    }

    useEffect(() => {
        async function connectAsync() {
            const connection = new HubConnectionBuilder()
                .withUrl(`http://localhost:6100/signalr/notifications-hub`)
                .withAutomaticReconnect(new ConnectionRetryPolicy())
                .build();

            connection.on("NotifyProductionDisconnected", () => {
                setIsConnected(false);
                message.error("Производство отключено");
            });

            connection.on("NotifyProductionConnected", async () => {
                setIsConnected(true);
                await reloadProductionData();
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

            connection.onreconnected(async () => {
                await checkProductionConnection().then(reloadProductionData);

                message.success(
                    "Вы были успешно переподключены к сети SmartWeb"
                );
            });

            connection.onclose(() => {
                setIsConnected(false);

                message.error(
                    "Вы были отключены от сети SmartWeb. Попробуйте переподключиться"
                );
            });

            connection
                .start()
                .then(async () => await checkProductionConnection())
                .then(async () => await reloadProductionData())
                .catch();
        }

        connectAsync();
    }, []);

    return (
        <>
            {!isConnected && (
                <WavyBackground>
                    <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
                        Подключение к производству...
                    </p>
                    <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                        Производство автоматически подключится через несколько
                        секунд. <br /> Если проблема долго не исчезает, то
                        вам необходимо проверить интернет подключение на
                        компьютере, где установлена программа SmartMix или
                        обновить страницу
                    </p>
                </WavyBackground>
            )}

            {isConnected && element}
        </>
    );
};

// <div className=" items-center justify-center h-full w-full p-6">
//     <Card bordered={true} className=" h-full w-full">
//         <Result
//             status="500"
//             title="Хьюстон, у нас проблемы..."
//             subTitle={`
//                         Ваше производство скоро переподключится, но если вы не верите, то можете потыкать на кнопку ниже.
//                         Если проблема долго не исчезает, то вам необходимо проверить интернет подключение на компьютере, где расположена программа SmartMix.`}
//             extra={
//                 <Button
//                     type="primary"
//                     onClick={OnRetryConnectHandle}
//                     disabled={isPingLoading}
//                 >
//                     Проверить подключение
//                 </Button>
//             }
//         />
//     </Card>
// </div>