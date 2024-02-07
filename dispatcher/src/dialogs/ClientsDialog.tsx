import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import React, { useState } from "react";
import { IoSave } from "react-icons/io5";
import { MdCancel, MdDelete, MdEdit } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { PagedList } from "../entities/PagedList";
import { ProductionClientDTO } from "../entities/ProductionClientDTO";
import { ClientsService } from "../services/ClientsService";
import { ApiError } from "../services/core/ApiError";
import { PaginationProps } from "../types/PaginationProps";
import { EditableCell } from "./EditableCell";

export type CreateClientDialogProps = {
    isOpen: boolean;
    onClose?(): void;
    onOk?(): void;
};

export interface ClientItem {
    id: number | undefined;
    address: string;
    name: string;
}

export const CreateClientDialog: React.FC<CreateClientDialogProps> = ({
    isOpen,
    onClose,
    onOk,
}) => {
    const [form] = Form.useForm();
    const [editingId, setEditingKey] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [clients, setClients] = useState<PagedList<ClientItem>>({
        items: [],
        totalItems: 0,
    });

    const { isLoading: isClientsLoading } = useQuery<
        PagedList<ProductionClientDTO>,
        ApiError
    >("loadClients", () => ClientsService.SearchAsync("", 0, 5), {
        onSuccess(data) {
            const fetchedOptions = data.items.map<ClientItem>((client) => ({
                id: client.id,
                address: client.address,
                name: client.name,
                editable: false,
            }));

            const pagedList: PagedList<ClientItem> = {
                items: fetchedOptions,
                totalItems: data.totalItems,
            };

            setClients(pagedList);
        },
    });

    const {
        isLoading: isClientsSearching,
        mutateAsync: searchClientsAsync,
    } = useMutation<PagedList<ProductionClientDTO>, ApiError, PaginationProps>(
        (pagination) =>
            ClientsService.SearchAsync(
                pagination.query,
                (pagination.page - 1) * pagination.pageSize,
                pagination.pageSize
            ),
        {
            onSuccess(data) {
                const fetchedOptions = data.items.map<ClientItem>((client) => ({
                    id: client.id,
                    address: client.address,
                    name: client.name,
                    editable: false,
                }));

                const pagedList: PagedList<ClientItem> = {
                    items: fetchedOptions,
                    totalItems: data.totalItems,
                };

                setClients(pagedList);
            },
        }
    );

    const {
        mutateAsync: updateClientAsync,
        isLoading: isClientUpdating,
    } = useMutation<ProductionClientDTO, ApiError, ProductionClientDTO>(
        (client) =>
            ClientsService.UpdateAsync(client.id, {
                name: client.name,
                address: client.address,
            })
    );

    const {
        mutateAsync: createClientAsync,
        isLoading: isClientCreating,
    } = useMutation<ProductionClientDTO, ApiError, ProductionClientDTO>(
        (client) =>
            ClientsService.CreateAsync({
                name: client.name,
                address: client.address,
            }),
        {
            onSuccess(Client) {
                console.log(clients.items);

                const filteredClients = clients.items.filter((c) => c.id != -1);

                filteredClients.push(Client);

                setClients({
                    items: filteredClients,
                    totalItems: clients.totalItems,
                });
            },
        }
    );

    const {
        mutateAsync: deleteClientAsync,
        isLoading: isClientDeleting,
    } = useMutation<void, ApiError, ProductionClientDTO>(
        (Client) => ClientsService.DeleteAsync(Client.id),
        {
            onSuccess(_, v) {
                setClients({
                    items: clients.items.filter((c) => c.id !== v.id),
                    totalItems: clients.totalItems - 1,
                });
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const columns = [
        {
            title: "Имя клиента",
            dataIndex: "name",
            editable: true,
        },
        {
            title: "Адрес",
            dataIndex: "address",
            editable: true,
        },
        {
            dataIndex: "operation",
            render: (_: any, record: ClientItem) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button type="link" onClick={() => save(record.id)}>
                            <IoSave color="geekblue" />
                        </Button>
                        <Popconfirm
                            title="Ваши изменения не сохранятся, вы  уверены что хотите выйти без сохранения?"
                            onConfirm={cancel}
                        >
                            <Button type="link">
                                <MdCancel />
                            </Button>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Button
                            type="link"
                            disabled={editingId !== undefined}
                            onClick={() => editClient(record)}
                        >
                            <MdEdit />
                        </Button>

                        <Button
                            type="link"
                            disabled={editingId !== undefined}
                            onClick={() => deleteClient(record)}
                        >
                            <MdDelete />
                        </Button>
                    </span>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ClientItem) => ({
                record,
                inputType: col.dataIndex === "age" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const isEditing = (record: ClientItem) => record.id === editingId;

    const editClient = (record: ClientItem) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const cancel = () => {
        if (editingId == -1) {
            setClients({
                items: clients.items.filter((c) => c.id !== editingId),
                totalItems: clients.totalItems - 1,
            });
        }

        return setEditingKey(undefined);
    };

    const deleteClient = async (record: ClientItem) => {
        await deleteClientAsync({
            id: record.id!,
            name: record.name,
            address: record.address,
        });
    };

    const addClient = async () => {
        const newClient: ClientItem = {
            id: -1,
            address: "",
            name: "Новый клиент",
        };

        const newData = [...clients.items];

        newData.unshift(newClient);

        setClients({ items: newData, totalItems: clients.totalItems + 1 });
        setCurrentPage(1);
        editClient(newClient);
    };

    const save = async (id: number | undefined) => {
        try {
            const row = (await form.validateFields()) as ClientItem;

            const newData = [...clients.items];
            const Client = newData.find((item) => id === item.id);

            if (Client?.id !== undefined && Client.id > -1) {
                const index = newData.findIndex((item) => id === item.id);
                const item = newData[index];

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                const newItem = newData[index];

                await updateClientAsync({
                    id: newItem.id!,
                    name: newItem.name,
                    address: newItem.address,
                });

                setClients({ items: newData, totalItems: clients.totalItems });
                setEditingKey(undefined);
            } else {
                await createClientAsync({
                    id: row.id!,
                    name: row.name,
                    address: row.address,
                });

                setEditingKey(undefined);
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);

        await searchClientsAsync({ page: 1, pageSize: 5, query: query });
    };

    const handlePageChanged = async (
        page: number,
        pageSize: number
    ): Promise<void> => {
        cancel();
        setCurrentPage(page);

        await searchClientsAsync({
            page: page,
            pageSize: pageSize,
            query: searchQuery,
        });
    };

    return (
        <Modal
            cancelButtonProps={{ disabled: true }}
            open={isOpen}
            onCancel={onClose}
            onOk={onOk}
            footer={null}
            closable={false}
            cancelText="Отмена"
            okText="Закрыть"
        >
            <div className=" space-y-2">
                <Input.Search
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Начните ввод для поиска"
                ></Input.Search>
                <Form form={form} component={false}>
                    <Table
                        loading={
                            isClientDeleting ||
                            isClientUpdating ||
                            isClientCreating ||
                            isClientsLoading ||
                            isClientsSearching
                        }
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        columns={mergedColumns}
                        dataSource={clients.items}
                        rowClassName="editable-row"
                        pagination={{
                            pageSize: pageSize,
                            current: currentPage,
                            total: clients.totalItems,
                            onChange: handlePageChanged,
                        }}
                    />
                </Form>
                <Button
                    disabled={editingId !== undefined}
                    className=" right-0"
                    onClick={addClient}
                >
                    Добавить клиента
                </Button>
            </div>
        </Modal>
    );
};
