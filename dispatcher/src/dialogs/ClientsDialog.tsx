import {
    Button,
    Divider,
    Input,
    List,
    Modal,
    Skeleton,
    Space,
    Spin,
    Typography,
    message,
} from "antd";
import Search from "antd/es/input/Search";
import React, { ChangeEvent, useState } from "react";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { InfiniteData, useInfiniteQuery, useMutation } from "react-query";
import { PagedList } from "../entities/PagedList";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import { CarsService } from "../services/CarsService";
import { ClientsService } from "../services/ClientsService";
import { ApiError } from "../services/core/ApiError";

export type CreateClientDialogProps = {
    isOpen: boolean;
    onClose?(): void;
    onOk?(): void;
};

export type ClientEditingProps<T extends ProductionClientDTO> = {
    data: T;
    onUpdate?(id: number, data: T): Promise<ProductionClientDTO>;
    onDelete?(id: number): Promise<void>;
    onCreate?(data: T): Promise<ProductionClientDTO>;
};

const CarEditingItem = <T extends ProductionClientDTO>(
    props: ClientEditingProps<T> & {}
) => {
    const [id, setId] = useState(props.data.id);

    const [updatedData, setUpdatedData] = useState(props.data);

    const [isEditing, setEditing] = useState(
        props.data.id == -1 ? true : false
    );

    const [isLoading, setLoading] = useState(false);

    const switchEditingMode = () => {
        setEditing(!isEditing);
    };

    const handleCancel = () => {
        setUpdatedData(props.data);
        switchEditingMode();
    };

    const handleDelete = async () => {
        setLoading(true);

        if (props.onDelete) {
            try {
                await props.onDelete(props.data.id);
            } catch {}
        }

        setLoading(false);
    };

    const handleUpdate = async () => {
        setLoading(true);

        if (props.data.id !== -1 && props.onUpdate) {
            try {
                const updatedClient = await props.onUpdate(id, updatedData);
                props.data.id = updatedClient.id;
                setId(updatedClient.id);
            } catch {}
        }

        if (props.data.id == -1 && props.onCreate) {
            try {
                const createdClient = await props.onCreate(updatedData);
                props.data.id = createdClient.id;
                setId(createdClient.id);
            } catch {}
        }

        props.data.name = updatedData.name;
        props.data.address = updatedData.address;

        switchEditingMode();
        setLoading(false);
    };

    const handleAddressChanged = (value: string) => {
        setUpdatedData({ ...updatedData, address: value });
    };

    const handleNameChanged = (value: string) => {
        setUpdatedData({ ...updatedData, name: value });
    };

    if (isEditing) {
        return (
            <>
                <Spin spinning={isLoading}>
                    <Space direction="vertical" className="w-full mt-2">
                        <Input
                            placeholder="Имя"
                            value={updatedData.name}
                            onChange={(e) => handleNameChanged(e.target.value)}
                            defaultValue={props.data.name}
                        ></Input>

                        <Input
                            className="w-full"
                            value={updatedData.address}
                            onChange={(e) =>
                                handleAddressChanged(e.target.value)
                            }
                            placeholder="Адрес"
                            defaultValue={props.data.address}
                        ></Input>

                        <div className=" text-right space-x-2">
                            <Button onClick={handleCancel}>Отменить</Button>
                            <Button onClick={handleUpdate} type="primary">
                                Сохранить
                            </Button>
                        </div>
                    </Space>
                </Spin>
            </>
        );
    }

    return (
        <>
            <Spin spinning={isLoading} key={props.data.id}>
                <List.Item
                    key={props.data.id}
                    actions={[
                        <Button
                            onClick={switchEditingMode}
                            icon={<MdModeEditOutline />}
                        />,
                        <Button
                            danger
                            onClick={handleDelete}
                            icon={<MdDeleteOutline />}
                        />,
                    ]}
                >
                    <>
                        <List.Item.Meta
                            title={props.data.name}
                            description={props.data.address.toString()}
                        />
                    </>
                </List.Item>
            </Spin>
        </>
    );
};

export const CreateClientDialog: React.FC<CreateClientDialogProps> = ({
    isOpen,
    onClose,
    onOk,
}) => {
    const [query, setQuery] = useState("");
    const [pageSize] = useState(10);
    const [clients, setClients] = useState<
        InfiniteData<PagedList<ProductionClientDTO>>
    >();

    const isNewClientExists = (): boolean => {
        return (
            clients?.pages.find((x) => x.items.find((x) => x.id == -1)) !==
            undefined
        );
    };

    const { isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery<
        PagedList<ProductionClientDTO>,
        ApiError
    >(
        ["loadClients", query],
        ({ pageParam = 1 }) => {
            return ClientsService.SearchAsync(
                query,
                (pageParam - 1) * pageSize,
                pageSize
            );
        },
        {
            enabled: isOpen,
            onSuccess: setClients,
            getNextPageParam: (_, allPages) => {
                if (allPages.length * pageSize > allPages[0].totalItems) {
                    return undefined;
                }

                const nextPage = allPages.length + 1;

                return nextPage;
            },
        }
    );

    const { mutateAsync: deleteClientAsync } = useMutation<
        void,
        ApiError,
        number
    >(
        async (id) => {
            if (id !== -1) {
                await ClientsService.DeleteAsync(id);
            }

            return;
        },
        {
            onError(err) {
                message.error(err.body.Details);
            },
            onSuccess(_, variables) {
                const newPages = clients?.pages.map<
                    PagedList<ProductionClientDTO>
                >((page) => ({
                    items: page.items.filter((x) => x.id !== variables),
                    totalItems: page.totalItems,
                }));

                if (newPages) {
                    setClients({
                        ...clients,
                        pages: newPages,
                        pageParams: clients?.pageParams ?? [],
                    });
                }
            },
        }
    );

    const { mutateAsync: updateClientAsync } = useMutation<
        ProductionClientDTO,
        ApiError,
        { id: number; data: ProductionClientDTO }
    >(
        (record) =>
            ClientsService.UpdateAsync(record.id, {
                name: record.data.name,
                address: record.data.address,
            }),
        {
            onError(err) {
                message.error(err.body.Details);
            },
        }
    );

    const { mutateAsync: createClientAsync } = useMutation<
        ProductionClientDTO,
        ApiError,
        ProductionClientDTO
    >(
        (client) =>
            ClientsService.CreateAsync({
                name: client.name,
                address: client.address,
            }),
        {
            onError(err) {
                message.error(err.body.Details);
            },
        }
    );

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleAddClient = () => {
        clients?.pages[0].items.push({
            name: "Новый клиент",
            address: "",
            id: -1,
        });

        setClients({ ...clients, pages: clients!.pages, pageParams: [] });
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
            <Search
                placeholder="Начните ввод для поиска"
                value={query}
                onChange={handleSearch}
            ></Search>

            <div
                id="scrollableDiv"
                className="overflow-auto"
                style={{ height: 400 }}
            >
                {isSuccess && clients?.pages && (
                    <InfiniteScroll
                        dataLength={clients.pages.reduce(
                            (acc, page) => acc + page.items.length,
                            0
                        )}
                        scrollableTarget="scrollableDiv"
                        next={fetchNextPage}
                        endMessage={
                            <>
                                <div className="text-center">
                                    <Divider />
                                    <Typography.Text className=" text-center">
                                        Больше ничего нет
                                    </Typography.Text>
                                </div>
                            </>
                        }
                        hasMore={hasNextPage ?? false}
                        loader={
                            <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
                        }
                    >
                        <List
                            dataSource={clients.pages}
                            renderItem={(item) =>
                                item.items.map((car) => (
                                    <CarEditingItem
                                        data={car}
                                        onCreate={createClientAsync}
                                        onDelete={deleteClientAsync}
                                        onUpdate={(e, v) =>
                                            updateClientAsync({
                                                id: e,
                                                data: v,
                                            })
                                        }
                                    />
                                ))
                            }
                        />
                    </InfiniteScroll>
                )}
            </div>

            <Button disabled={isNewClientExists()} onClick={handleAddClient}>
                Добавить
            </Button>
        </Modal>
    );
};
