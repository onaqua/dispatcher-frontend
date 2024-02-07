import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import React, { useState } from "react";
import { IoSave } from "react-icons/io5";
import { MdCancel, MdDelete, MdEdit } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { PagedList } from "../entities/PagedList";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import { CarsService } from "../services/CarsService";
import { ApiError } from "../services/core/ApiError";
import { PaginationProps } from "../types/PaginationProps";
import { EditableCell } from "./EditableCell";
import { Permission } from "../components/Permission";
import { DispatcherPermissions } from "../consts/Permissions";

export type CreateCarDialogProps = {
    isOpen: boolean;
    onClose?(): void;
    onOk?(): void;
};

export interface CarItem {
    id: number | undefined;
    plateNumber: string;
    volume: number;
}

export const CreateCarDialog: React.FC<CreateCarDialogProps> = ({
    isOpen,
    onClose,
    onOk,
}) => {
    const [form] = Form.useForm();
    const [editingId, setEditingKey] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [cars, setCars] = useState<PagedList<CarItem>>({
        items: [],
        totalItems: 0,
    });

    const { isLoading: isCarsLoading } = useQuery<
        PagedList<ProductionCarDTO>,
        ApiError
    >("loadCars", () => CarsService.SearchAsync("", 0, 5), {
        onSuccess(data) {
            const fetchedOptions = data.items.map<CarItem>((car) => ({
                id: car.id,
                plateNumber: car.plateNumber,
                volume: car.volume,
                editable: false,
            }));

            const pagedList: PagedList<CarItem> = {
                items: fetchedOptions,
                totalItems: data.totalItems,
            };

            setCars(pagedList);
        },
    });

    const {
        isLoading: isCarsSearching,
        mutateAsync: searchCarsAsync,
    } = useMutation<PagedList<ProductionCarDTO>, ApiError, PaginationProps>(
        (pagination) =>
            CarsService.SearchAsync(
                pagination.query,
                (pagination.page - 1) * pagination.pageSize,
                pagination.pageSize
            ),
        {
            onSuccess(data) {
                const fetchedOptions = data.items.map<CarItem>((car) => ({
                    id: car.id,
                    plateNumber: car.plateNumber,
                    volume: car.volume,
                    editable: false,
                }));

                const pagedList: PagedList<CarItem> = {
                    items: fetchedOptions,
                    totalItems: data.totalItems,
                };

                setCars(pagedList);
            },
        }
    );

    const {
        mutateAsync: updateCarAsync,
        isLoading: isCarUpdating,
    } = useMutation<ProductionCarDTO, ApiError, ProductionCarDTO>((car) =>
        CarsService.UpdateAsync(car.id, {
            volume: car.volume,
            plateNumber: car.plateNumber,
        })
    );

    const {
        mutateAsync: createCarAsync,
        isLoading: isCarCreating,
    } = useMutation<ProductionCarDTO, ApiError, ProductionCarDTO>(
        (car) =>
            CarsService.CreateAsync({
                volume: car.volume,
                plateNumber: car.plateNumber,
            }),
        {
            onSuccess(car) {
                console.log(cars.items);

                const filteredCars = cars.items.filter((c) => c.id != -1);

                filteredCars.push(car);

                setCars({ items: filteredCars, totalItems: cars.totalItems });
            },
        }
    );

    const {
        mutateAsync: deleteCarAsync,
        isLoading: isCarDeleting,
    } = useMutation<void, ApiError, ProductionCarDTO>(
        (car) => CarsService.DeleteAsync(car.id),
        {
            onSuccess(_, v) {
                setCars({
                    items: cars.items.filter((c) => c.id !== v.id),
                    totalItems: cars.totalItems - 1,
                });
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const columns = [
        {
            title: "Номер автомобиля",
            dataIndex: "plateNumber",
            editable: true,
        },
        {
            title: "Объём автомобиля",
            dataIndex: "volume",
            editable: true,
        },
        {
            dataIndex: "operation",
            render: (_: any, record: CarItem) => {
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
                            onClick={() => editCar(record)}
                        >
                            <MdEdit />
                        </Button>

                        <Button
                            type="link"
                            disabled={editingId !== undefined}
                            onClick={() => deleteCar(record)}
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
            onCell: (record: CarItem) => ({
                record,
                inputType: col.dataIndex === "age" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const isEditing = (record: CarItem) => record.id === editingId;

    const editCar = (record: CarItem) => {
        form.setFieldsValue({ name: "", age: "", address: "", ...record });
        setEditingKey(record.id);
    };

    const cancel = () => {
        if (editingId == -1) {
            setCars({
                items: cars.items.filter((c) => c.id !== editingId),
                totalItems: cars.totalItems - 1,
            });
        }

        return setEditingKey(undefined);
    };

    const deleteCar = async (record: CarItem) => {
        await deleteCarAsync({
            id: record.id!,
            plateNumber: record.plateNumber,
            volume: record.volume,
        });
    };

    const addCar = async () => {
        const newCar = { id: -1, volume: 0, plateNumber: "Новая машина" };
        const newData = [...cars.items];

        newData.unshift(newCar);

        setCars({ items: newData, totalItems: cars.totalItems + 1 });
        setCurrentPage(1);
        editCar(newCar);
    };

    const save = async (id: number | undefined) => {
        try {
            const row = (await form.validateFields()) as CarItem;

            const newData = [...cars.items];
            const car = newData.find((item) => id === item.id);

            if (car?.id !== undefined && car.id > -1) {
                const index = newData.findIndex((item) => id === item.id);
                const item = newData[index];

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                const newItem = newData[index];

                await updateCarAsync({
                    id: newItem.id!,
                    plateNumber: newItem.plateNumber,
                    volume: newItem.volume,
                });

                setCars({ items: newData, totalItems: cars.totalItems });
                setEditingKey(undefined);
            } else {
                await createCarAsync({
                    id: row.id!,
                    plateNumber: row.plateNumber,
                    volume: row.volume,
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

        await searchCarsAsync({ page: 1, pageSize: 5, query: query });
    };

    const handlePageChanged = async (
        page: number,
        pageSize: number
    ): Promise<void> => {
        cancel();
        setCurrentPage(page);

        await searchCarsAsync({
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
                            isCarDeleting ||
                            isCarUpdating ||
                            isCarCreating ||
                            isCarsLoading ||
                            isCarsSearching
                        }
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        columns={mergedColumns}
                        dataSource={cars.items}
                        rowClassName="editable-row"
                        pagination={{
                            pageSize: pageSize,
                            current: currentPage,
                            total: cars.totalItems,
                            onChange: handlePageChanged,
                        }}
                    />
                </Form>
                <Permission need={DispatcherPermissions.CarsCreate}>
                    <Button
                        disabled={editingId !== undefined}
                        className=" right-0"
                        onClick={addCar}
                    >
                        Добавить автомобиль
                    </Button>
                </Permission>
            </div>
        </Modal>
    );
};
