import
    {
        Button,
        Divider,
        Input,
        InputNumber,
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
import { Car } from "../entities/Car";
import { PagedList } from "../entities/PagedList";
import { CarsService } from "../services/CarsService";
import { ApiError } from "../services/core/ApiError";

export type CreateCarDialogProps = {
    isOpen: boolean;
    onClose?(): void;
    onOk?(): void;
};

export type CarEditingItemProps<T extends Car> = {
    data: T;
    onUpdate?(id: number, data: T): Promise<Car>;
    onDelete?(id: number): Promise<void>;
    onCreate?(data: T): Promise<Car>;
};

const CarEditingItem = <T extends Car>(
    props: CarEditingItemProps<T> & {}
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
                const updatedCar = await props.onUpdate(id, updatedData);
                props.data.id = updatedCar.id;
                setId(updatedCar.id);
            } catch {}
        }

        if (props.data.id == -1 && props.onCreate) {
            try {
                const createdCar = await props.onCreate(updatedData);
                props.data.id = createdCar.id;
                setId(createdCar.id);
            } catch {}
        }

        props.data.name = updatedData.name;
        props.data.volume = updatedData.volume;

        switchEditingMode();
        setLoading(false);
    };

    const handleVolumeChanged = (value: number) => {
        setUpdatedData({ ...updatedData, volume: value });
    };

    const handleNumberChanged = (number: string) => {
        setUpdatedData({ ...updatedData, name: number });
    };

    if (isEditing) {
        return (
            <>
                <Spin spinning={isLoading}>
                    <Space direction="vertical" className="w-full mt-2">
                        <Input
                            placeholder="Гос. номер"
                            value={updatedData.name}
                            onChange={(e) =>
                                handleNumberChanged(e.target.value)
                            }
                            defaultValue={props.data.name}
                        ></Input>

                        <InputNumber
                            className="w-full"
                            value={updatedData.volume}
                            onChange={(e) => handleVolumeChanged(e ?? 0)}
                            placeholder="Объём автомобиля"
                            defaultValue={props.data.volume}
                        ></InputNumber>

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
                            description={props.data.volume.toString()}
                        />
                    </>
                </List.Item>
            </Spin>
        </>
    );
};

// export const CreateCarDialog: React.FC<CreateCarDialogProps> = ({
//     isOpen,
//     onClose,
//     onOk,
// }) => {
    // const [query, setQuery] = useState("");
    // const [pageSize] = useState(10);
    // const [cars, setCars] = useState<
    //     InfiniteData<PagedList<Car>>
    // >();

    // const isNewCarExists = (): boolean => {
    //     return (
    //         cars?.pages.find((x) => x.find((x) => x.id == -1)) !==
    //         undefined
    //     );
    // };

    // const { isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery<
    //     PagedList<Car>,
    //     ApiError
    // >(
    //     ["loadCars", query],
    //     ({ pageParam = 1 }) => {
    //         return CarsService.SearchAsync(
    //             query,
    //             pageParam,
    //             pageSize
    //         );
    //     },
    //     {
    //         enabled: isOpen,
    //         onSuccess: setCars,
    //         getNextPageParam: (_, allPages) => {
    //             if (allPages.length * pageSize > allPages[0].totalItemCount) {
    //                 return undefined;
    //             }

    //             const nextPage = allPages.length + 1;

    //             return nextPage;
    //         },
    //     }
    // );

    // const { mutateAsync: deleteCarAsync } = useMutation<void, ApiError, number>(
    //     async (id) => {
    //         if (id !== -1) {
    //             await CarsService.DeleteAsync(id);
    //         }

    //         return;
    //     },
    //     {
    //         onError(err) {
    //             message.error(err.body.Details);
    //         },
    //         onSuccess(_, variables) {
    //             const newPages = cars?.pages.flatMap(x => x.filter(c => c.id !== variables));
                
    //             if (newPages) {
    //                 setCars({
    //                     ...cars,
    //                     pages: newPages,
    //                     pageParams: cars?.pageParams ?? [],
    //                 });
    //             }
    //         },
    //     }
    // );

    // const { mutateAsync: updateCarAsync } = useMutation<
    //     Car,
    //     ApiError,
    //     { id: number; data: Car }
    // >(
    //     (record) =>
    //         CarsService.UpdateAsync(record.id, {
    //             name: record.data.name,
    //             volume: record.data.volume,
    //         }),
    //     {
    //         onError(err) {
    //             message.error(err.body.Details);
    //         },
    //     }
    // );

    // const { mutateAsync: createCarAsync } = useMutation<
    //     Car,
    //     ApiError,
    //     Car
    // >(
    //     (car) =>
    //         CarsService.CreateAsync({
    //             name: car.name,
    //             volume: car.volume,
    //         }),
    //     {
    //         onError(err) {
    //             message.error(err.body.Details);
    //         },
    //     }
    // );

    // const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    //     setQuery(event.target.value);
    // };

    // const handleAddCar = () => {
    //     cars?.pages[0].items.push({
    //         volume: 0,
    //         name: "Новый автомобиль",
    //         id: -1,
    //     });

    //     setCars({ ...cars, pages: cars!.pages, pageParams: [] });
    // };

    // return (
    //     <Modal
    //         cancelButtonProps={{ disabled: true }}
    //         open={isOpen}
    //         onCancel={onClose}
    //         onOk={onOk}
    //         footer={null}
    //         closable={false}
    //         cancelText="Отмена"
    //         okText="Закрыть"
    //     >
    //         <Search
    //             placeholder="Начните ввод для поиска"
    //             value={query}
    //             onChange={handleSearch}
    //         ></Search>

    //         <div
    //             id="scrollableDiv"
    //             className="overflow-auto"
    //             style={{ height: 400 }}
    //         >
    //             {isSuccess && cars?.pages && (
    //                 <InfiniteScroll
    //                     dataLength={cars.pages.reduce(
    //                         (acc, page) => acc + page.items.length,
    //                         0
    //                     )}
    //                     endMessage={
    //                         <>
    //                             <div className="text-center">
    //                                 <Divider />
    //                                 <Typography.Text className=" text-center">
    //                                     Больше ничего нет
    //                                 </Typography.Text>
    //                             </div>
    //                         </>
    //                     }
    //                     scrollableTarget="scrollableDiv"
    //                     next={fetchNextPage}
    //                     hasMore={hasNextPage ?? false}
    //                     loader={
    //                         <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
    //                     }
    //                 >
    //                     <List
    //                         dataSource={cars.pages}
    //                         renderItem={(item) =>
    //                             item.items.map((car) => (
    //                                 <CarEditingItem
    //                                     data={car}
    //                                     onCreate={createCarAsync}
    //                                     onDelete={deleteCarAsync}
    //                                     onUpdate={(e, v) =>
    //                                         updateCarAsync({ id: e, data: v })
    //                                     }
    //                                 />
    //                             ))
    //                         }
    //                     />
    //                 </InfiniteScroll>
    //             )}
    //         </div>

    //         <Button disabled={isNewCarExists()} onClick={handleAddCar}>
    //             Добавить
    //         </Button>
    //     </Modal>
    // );
// };
