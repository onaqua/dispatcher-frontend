import {
    Badge,
    Button,
    Card,
    Popconfirm,
    Table,
    Typography,
    message,
} from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import {
    ApplicationStatus,
    ProductionApplicationDTO,
    ProductionLayerDTO,
} from "../entities/ApplicationDTO";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import { ApplicationsService } from "../services/ApplicationsService";
import { ApiError } from "../services/core/ApiError";
import { RootState } from "../store/store";
import {
    ApplicationDialog,
    ApplicationDialogProps,
} from "../dialogs/ApplicatonDialog";
import { useState } from "react";

export const QueuePanel: React.FC = () => {
    const applications = useSelector(
        (state: RootState) => state.applicationsInQueue.applications
    );

    const [dialogState, setDialogState] = useState<ApplicationDialogProps>({
        isOpen: false,
        isOperatorQueue: false,
        applicationId: 0,
    });

    const {
        isLoading: isDeleteLoading,
        mutateAsync: deleteApplicationAsync,
    } = useMutation<void, ApiError, number>(
        (id) => ApplicationsService.DeleteInQueueAsync(id),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    async function handleDeleteApplication(applicationId: number) {
        await deleteApplicationAsync(applicationId);
    }

    function openApplicationDialog(applicationId: number) {
        setDialogState({
            applicationId: applicationId,
            isOperatorQueue: true,
            isOpen: true,
        });
    }

    function closeApplicationDialog() {
        setDialogState({
            isOpen: false,
            isOperatorQueue: false,
        });
    }

    return (
        <>
            <ApplicationDialog
                isOpen={dialogState.isOpen}
                isOperatorQueue={dialogState.isOperatorQueue}
                applicationId={dialogState.applicationId}
                onClose={closeApplicationDialog}
                onOk={closeApplicationDialog}
            />

            <Card className=" h-full" title="Очередь оператора">
                <div className=" overflow-hidden">
                    <Table
                        size="small"
                        className=" min-h-80 max-h-80"
                        loading={isDeleteLoading}
                        dataSource={applications}
                        pagination={{ pageSize: 3 }}
                        locale={{ emptyText: "Нет заявок" }}
                    >
                        <Table.Column
                            title="№"
                            dataIndex="id"
                            render={(id) => {
                                return (
                                    <>
                                        <Typography.Link
                                            onClick={() =>
                                                openApplicationDialog(
                                                    id as number
                                                )
                                            }
                                        >
                                            <strong>{id}</strong>
                                        </Typography.Link>
                                    </>
                                );
                            }}
                        ></Table.Column>
                        <Table.Column
                            title="Рецепты"
                            dataIndex="layers"
                            render={(layers: Array<ProductionLayerDTO>) => {
                                const recipes = layers
                                    .map((layer) => layer.recipe.name)
                                    .join(", ");

                                return (
                                    <Typography.Text>{recipes}</Typography.Text>
                                );
                            }}
                        />

                        <Table.Column
                            title="Объём"
                            dataIndex="volume"
                        ></Table.Column>

                        <Table.Column
                            title="Фактический объём"
                            dataIndex="currentVolume"
                        ></Table.Column>

                        <Table.Column
                            title="Клиент"
                            dataIndex="client"
                            render={(client: ProductionClientDTO) => (
                                <Typography.Text>{client.name}</Typography.Text>
                            )}
                        />

                        <Table.Column
                            title="Машина"
                            dataIndex="car"
                            render={(car: ProductionCarDTO) => (
                                <Typography.Text>
                                    {car.plateNumber}
                                </Typography.Text>
                            )}
                        />

                        <Table.Column
                            title="Статус"
                            dataIndex="status"
                            render={(status) => {
                                switch (status as ApplicationStatus) {
                                    case ApplicationStatus.Complete:
                                        return (
                                            <Badge
                                                status="success"
                                                text="Выполнена"
                                            />
                                        );
                                    case ApplicationStatus.DosingIsCompleted:
                                        return (
                                            <Badge
                                                status="processing"
                                                text="Дозирование окончено"
                                            />
                                        );
                                    case ApplicationStatus.Mixing:
                                        return (
                                            <Badge
                                                status="processing"
                                                text="Перемешивание"
                                            />
                                        );
                                    case ApplicationStatus.Run:
                                        return (
                                            <Badge
                                                status="processing"
                                                text="Выгрузка из смесителя"
                                            />
                                        );
                                    case ApplicationStatus.UnloadingIntoMixer:
                                        return (
                                            <Badge
                                                status="processing"
                                                text="Выгрузка в смеситель"
                                            />
                                        );
                                    case ApplicationStatus.Dosing:
                                        return (
                                            <Badge
                                                status="processing"
                                                text="Дозирование"
                                            />
                                        );
                                    case ApplicationStatus.Wait:
                                        return (
                                            <Badge
                                                status="warning"
                                                text="В очереди"
                                            />
                                        );
                                    case ApplicationStatus.WaitForDosing:
                                        return (
                                            <Badge
                                                status="warning"
                                                text="Ожидает подготовки к дозированию"
                                            />
                                        );
                                    default:
                                        return (
                                            <span className="text-red-500">
                                                Ошибка
                                            </span>
                                        );
                                }
                            }}
                        ></Table.Column>

                        <Table.Column
                            title="Действие"
                            key="action"
                            render={(
                                _,
                                application: ProductionApplicationDTO
                            ) => {
                                return (
                                    <Button
                                        disabled={
                                            application.status !=
                                            ApplicationStatus.Wait
                                        }
                                        size="large"
                                        danger
                                        type="link"
                                        onClick={() =>
                                            handleDeleteApplication(
                                                application.id
                                            )
                                        }
                                        icon={<MdDeleteOutline />}
                                    ></Button>
                                );
                            }}
                        />
                    </Table>
                </div>
            </Card>
        </>
    );
};

export default QueuePanel;
