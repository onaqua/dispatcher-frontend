import { Button, Card, Space, Table, Typography, message } from "antd";
import { IoArrowDownCircleOutline } from "react-icons/io5";

import { MdOutlineDelete } from "react-icons/md";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { DispatcherPermissions } from "../consts/Permissions";
import { ApplicationsService } from "../services/ApplicationsService";
import { ApiError } from "../services/core/ApiError";
import { RootState } from "../store/store";
import { Permission } from "./Permission";
import { Application } from "../entities/Application";

export const PreQueuePanel: React.FC = () => {
    const applications = useSelector(
        (state: RootState) => state.applicationsInPreQueue.applications
    );

    const {
        isLoading: isApplicationAdding,
        mutateAsync: addApplicationInQueueAsync,
    } = useMutation<void, ApiError, number>(
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
                    pagination={{
                        pageSize: 3,
                        hideOnSinglePage: true,
                        showTotal(total, range) {
                            return (
                                <Typography.Text className=" text-left">
                                    Показано {range[1]} из {total}
                                </Typography.Text>
                            );
                        },
                    }}
                    loading={isApplicationAdding || isApplicationDeleting}
                    className=" min-h-64 max-h-64 overflow-hidden"
                >
                    <Table.Column title="Номер" dataIndex={"id"}></Table.Column>

                    <Table.Column
                        title="Рецепты"
                        responsive={["lg", "xs", "sm", "xl"]}
                        render={(_, v: Application) =>
                            v.layers.map((l) => l.recipe.name).join(", ")
                        }
                    ></Table.Column>

                    <Table.Column
                        title="Объём"
                        responsive={["xxl", "sm"]}
                        dataIndex={"volume"}
                    ></Table.Column>

                    <Table.Column
                        title="Клиент"
                        responsive={["xxl"]}
                        render={(_, v: Application) => (
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
                        responsive={["xxl"]}
                        render={(_, v: Application) => (
                            <Permission
                                need={DispatcherPermissions.CarsView}
                                forbiddenText="Нет доступа"
                            >
                                {v.car.name}
                            </Permission>
                        )}
                    ></Table.Column>

                    <Table.Column
                        title="Действия"
                        render={(_, v: Application) => (
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
