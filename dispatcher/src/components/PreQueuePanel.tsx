import { useSortable } from "@dnd-kit/sortable";
import { Button, Card, Space, Table, message } from "antd";
import { IoArrowDownCircleOutline } from "react-icons/io5";

import { CSS } from "@dnd-kit/utilities";
import { MdOutlineDelete } from "react-icons/md";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { ProductionApplicationDTO } from "../entities/ApplicationDTO";
import { ApplicationsService } from "../services/ApplicationsService";
import { ApiError } from "../services/core/ApiError";
import { RootState } from "../store/store";
import { Permission } from "./Permission";
import { DispatcherPermissions } from "../consts/Permissions";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    "data-row-key": string;
}

const Row = (props: RowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props["data-row-key"],
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && { ...transform, scaleY: 1 }
        ),
        transition,
        cursor: "move",
        ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
    };

    return (
        <tr
            {...props}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        />
    );
};

export const PreQueuePanel: React.FC = () => {
    const applications = useSelector(
        (state: RootState) => state.applicationsInPreQueue.applications
    );

    const {
        isLoading: isApplicationAdding,
        mutateAsync: addApplicationInQueueAsync,
    } = useMutation<Array<ProductionApplicationDTO>, ApiError, number>(
        (id) => ApplicationsService.AddInQueueAsync(id),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const {
        isLoading: isApplicationDeleting,
        mutateAsync: deleteApplicationInPreQueueAsync,
    } = useMutation<void, ApiError, number>(
        (id) => ApplicationsService.DeleteInPreQueueAsync(id),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    async function handleSubmitApplication(
        applicationId: number
    ): Promise<void> {
        await addApplicationInQueueAsync(applicationId);
    }

    async function handleDeleteApplication(
        applicationId: number
    ): Promise<void> {
        await deleteApplicationInPreQueueAsync(applicationId);
    }

    return (
        <>
            <Card title="Предварительная очередь">
                <Table
                    size="small"
                    dataSource={applications}
                    pagination={{ pageSize: 3, hideOnSinglePage: true }}
                    loading={isApplicationAdding || isApplicationDeleting}
                    className=" min-h-64 max-h-64 overflow-hidden"
                >
                    <Table.Column title="Номер" dataIndex={"id"}></Table.Column>

                    <Table.Column
                        title="Объём"
                        dataIndex={"volume"}
                    ></Table.Column>

                    <Table.Column
                        title="Рецепты"
                        render={(_, v: ProductionApplicationDTO) =>
                            v.layers.map((l) => l.recipe.name).join(", ")
                        }
                    ></Table.Column>

                    <Table.Column
                        title="Клиент"
                        render={(_, v: ProductionApplicationDTO) => (
                            <Permission
                                need={DispatcherPermissions.ClientsView}
                                forbiddenText="Нет доступа"
                            >
                                {v.client.name}
                            </Permission>
                        )}
                    ></Table.Column>

                    <Table.Column
                        title="Машина"
                        render={(_, v: ProductionApplicationDTO) => (
                            <Permission
                                need={DispatcherPermissions.CarsView}
                                forbiddenText="Нет доступа"
                            >
                                {v.car.plateNumber}
                            </Permission>
                        )}
                    ></Table.Column>

                    <Table.Column
                        title="Действия"
                        render={(_, v: ProductionApplicationDTO) => (
                            <Space>
                                <Permission
                                    need={
                                        DispatcherPermissions.ApplicationsInQueueCreate
                                    }
                                >
                                    <Button
                                        type="link"
                                        size="large"
                                        onClick={() =>
                                            handleSubmitApplication(v.id)
                                        }
                                        icon={<IoArrowDownCircleOutline />}
                                    />
                                </Permission>

                                <Permission
                                    need={
                                        DispatcherPermissions.ApplicationsInPreQueueDelete
                                    }
                                >
                                    <Button
                                        type="link"
                                        danger
                                        size="large"
                                        onClick={() =>
                                            handleDeleteApplication(v.id)
                                        }
                                        icon={<MdOutlineDelete />}
                                    />
                                </Permission>
                            </Space>
                        )}
                    ></Table.Column>
                </Table>
            </Card>
        </>
    );
};

export default PreQueuePanel;
