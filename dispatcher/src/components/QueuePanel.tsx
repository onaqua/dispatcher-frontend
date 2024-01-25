import {
    Badge,
    Button,
    Card,
    Popconfirm,
    Table,
    Tooltip,
    Typography,
    message,
} from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import {
    ApplicationStatus,
    ProductionLayerDTO,
} from "../entities/ApplicationDTO";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import { RootState } from "../store/store";
import { ApiError } from "../services/core/ApiError";
import { useMutation } from "react-query";
import { ApplicationsService } from "../services/AuthorizationService";

export const QueuePanel: React.FC = () => {
    const applications = useSelector(
        (state: RootState) => state.applicationsInQueue.applications
    );

    const { isLoading, mutateAsync: deleteApplicationAsync } = useMutation<
        void,
        ApiError,
        number
    >((id) => ApplicationsService.DeleteInQueueAsync(id), {
        onError(error) {
            message.error(error.body.Details);
        },
    });

    async function onDeleteConfirm(applicationId: number) {
        await deleteApplicationAsync(applicationId);
    }

    return (
        <Card className=" w-full max-h-full h-full">
            <Table
                loading={isLoading}
                dataSource={applications}
                size="small"
                pagination={{ pageSize: 5 }}
            >
                <Table.Column title="№" dataIndex="id"></Table.Column>
                <Table.Column
                    title="Рецепты"
                    dataIndex="layers"
                    render={(l) => {
                        const layers = l as Array<ProductionLayerDTO>;

                        const recipes = layers
                            .map((layer) => layer.recipe.name)
                            .join(", ");

                        return <Typography.Text>{recipes}</Typography.Text>;
                    }}
                />

                <Table.Column title="Объём" dataIndex="volume"></Table.Column>

                <Table.Column
                    title="Фактический объём"
                    dataIndex="currentVolume"
                ></Table.Column>

                <Table.Column
                    title="Клиент"
                    dataIndex="client"
                    render={(c) => {
                        const client = c as ProductionClientDTO;
                        return <Typography.Text>{client.name}</Typography.Text>;
                    }}
                />

                <Table.Column
                    title="Машина"
                    dataIndex="car"
                    render={(c) => {
                        const car = c as ProductionCarDTO;
                        return (
                            <Typography.Text>{car.plateNumber}</Typography.Text>
                        );
                    }}
                />

                <Table.Column
                    title="Статус"
                    dataIndex="status"
                    render={(status) => {
                        switch (status as ApplicationStatus) {
                            case ApplicationStatus.Complete:
                                return (
                                    <Badge status="success" text="Выполнена" />
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
                                    <Badge status="warning" text="В очереди" />
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
                                    <span className="text-red-500">Ошибка</span>
                                );
                        }
                    }}
                ></Table.Column>
                <Table.Column
                    title="Действие"
                    dataIndex="id"
                    render={(id) => {
                        return (
                            <Popconfirm
                                title="Вы действительно хотите удалить заявку из очереди?"
                                okText="Да, удалить"
                                cancelText="Нет"
                                onConfirm={() => {
                                    onDeleteConfirm(id as number);
                                }}
                            >
                                <Tooltip
                                    title="Удалить заявку из списка оператора"
                                    color="geekblue"
                                >
                                    <Button
                                        size="large"
                                        danger
                                        type="link"
                                        icon={<MdDeleteOutline />}
                                    ></Button>
                                </Tooltip>
                            </Popconfirm>
                        );
                    }}
                />
            </Table>
        </Card>
    );
};

export default QueuePanel;
