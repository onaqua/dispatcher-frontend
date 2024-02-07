import {
    Badge,
    Button,
    Card,
    Col,
    DatePicker,
    Input,
    List,
    Row,
    Space,
    Table,
    Tooltip,
    Typography,
    message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { PagedList } from "../entities/PagedList";
import {
    EventLevel,
    EventStatus,
    ProductionEventDTO,
} from "../entities/ProductionEventDTO";
import { EventsService } from "../services/AuthorizationService";
import { ApiError } from "../services/core/ApiError";
import Select, { DefaultOptionType } from "antd/es/select";
import { Link } from "react-router-dom";
import { TracingBeam } from "../components/TracingBeam";

type RangeValue = Parameters<
    NonNullable<React.ComponentProps<typeof DatePicker.RangePicker>["onChange"]>
>[0];

type GetEventsProps = {
    offset: number;
    quantity: number;
    rangeDate?: RangeValue;
    userName?: string;
    objectName?: string;
    status?: EventStatus | null;
    level?: EventLevel | null;
};

export const EventsPage: React.FC = () => {
    const dispatch = useDispatch();

    const [rangeDate, setRangeDate] = React.useState<RangeValue>([
        dayjs().add(-7, "day"),
        dayjs().add(1, "day"),
    ]);

    const [events, setEvents] = React.useState<PagedList<ProductionEventDTO>>({
        items: [],
        totalItems: 0,
    });

    const [objectName, setObjectName] = React.useState<string>("");
    const [userName, setUserName] = React.useState<string>("");
    const [pageSize, setPageSize] = React.useState<number>(5);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [eventsLevel, setEventsLevel] = React.useState<EventLevel | null>();

    const levelOptions: DefaultOptionType[] = [
        { label: "Все уровни событий", value: null },
        { label: "Авария", value: EventLevel.Accident },
        { label: "Системная ошибка", value: EventLevel.SystemError },
        { label: "Изменение настроек", value: EventLevel.Settings },
        { label: "Действия оператора", value: EventLevel.Information },
    ];

    const { isLoading, mutateAsync: getEventsAsync } = useMutation<
        PagedList<ProductionEventDTO>,
        ApiError,
        GetEventsProps
    >(
        (props) =>
            EventsService.GetAsync(
                props.offset,
                props.quantity,
                props.objectName,
                props.userName,
                props.rangeDate?.[0],
                props.rangeDate?.[1],
                null,
                props.level
            ),
        {
            onSuccess(data) {
                setEvents(data);
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const handleUserNameChanged = async (value: string) => {
        setCurrentPage(1);
        setUserName(value);

        await getEventsAsync({
            offset: (currentPage - 1) * pageSize,
            quantity: pageSize,
            level: eventsLevel,
            rangeDate: rangeDate,
            userName: value,
            objectName: objectName,
        });
    };

    const handleDateChanged = async (value: RangeValue) => {
        setCurrentPage(1);
        setRangeDate(value);

        await getEventsAsync({
            offset: (currentPage - 1) * pageSize,
            quantity: pageSize,
            level: eventsLevel,
            rangeDate: value,
            userName: userName,
            objectName: objectName,
        });
    };

    const handleObjectNameChanged = async (value: string) => {
        setCurrentPage(1);
        setObjectName(value);

        await getEventsAsync({
            offset: (currentPage - 1) * pageSize,
            quantity: pageSize,
            level: eventsLevel,
            rangeDate: rangeDate,
            userName: userName,
            objectName: value,
        });
    };

    const handleLevelChanged = async (value: EventLevel | null) => {
        setCurrentPage(1);
        setEventsLevel(value);

        await getEventsAsync({
            offset: (currentPage - 1) * pageSize,
            quantity: pageSize,
            level: value,
            rangeDate: rangeDate,
            userName: userName,
            objectName: objectName,
        });
    };

    useEffect(() => {
        getEventsAsync({
            offset: 0,
            quantity: 20,
            level: eventsLevel,
            rangeDate: rangeDate,
        });
    }, []);

    return (
        <div className=" space-y-2 w-full p-8 h-full">
            <Card>
                <Row style={{ marginBottom: 8 }}>
                    <Col
                        xl={6}
                        lg={6}
                        md={6}
                        sm={24}
                        xs={24}
                        className="gutter-row p-2"
                    >
                        <DatePicker.RangePicker
                            allowClear={false}
                            className=" w-full"
                            format="DD.MM.YYYY"
                            value={rangeDate}
                            onChange={handleDateChanged}
                            placeholder={["Дата начала", "Дата окончания"]}
                        ></DatePicker.RangePicker>
                    </Col>

                    <Col
                        xl={6}
                        lg={6}
                        md={6}
                        sm={24}
                        xs={24}
                        className="gutter-row p-2"
                    >
                        <Select
                            className=" w-full"
                            popupMatchSelectWidth={false}
                            allowClear
                            placeholder="Уровень события"
                            value={eventsLevel}
                            options={levelOptions}
                            onClear={() => handleLevelChanged(null)}
                            onSelect={handleLevelChanged}
                        ></Select>
                    </Col>

                    <Col
                        xl={6}
                        lg={6}
                        md={6}
                        sm={24}
                        xs={24}
                        className="gutter-row p-2"
                    >
                        <Input
                            className=" w-full"
                            allowClear
                            placeholder="Название объекта"
                            value={objectName}
                            onChange={(event) =>
                                handleObjectNameChanged(event.target.value)
                            }
                        ></Input>
                    </Col>

                    <Col
                        xl={6}
                        lg={6}
                        md={6}
                        sm={24}
                        xs={24}
                        className="gutter-row p-2"
                    >
                        <Input
                            className=" w-full"
                            allowClear
                            placeholder="Имя пользователя"
                            value={userName}
                            onChange={(event) =>
                                handleUserNameChanged(event.target.value)
                            }
                        ></Input>
                    </Col>
                </Row>
            </Card>

            <Card>
                <Table
                    className=""
                    locale={{ emptyText: "Нет событий" }}
                    loading={isLoading}
                    dataSource={events.items}
                    getContainerWidth={() => document.body.clientWidth - 240}
                    rowClassName="mb-10"
                    pagination={{
                        defaultPageSize: pageSize,
                        pageSizeOptions: [5, 10, 25],
                        pageSize: pageSize,
                        current: currentPage,
                        total: events.totalItems,
                        onShowSizeChange(_, size) {
                            setPageSize(size);
                        },
                        onChange(page, pageSize) {
                            setCurrentPage(page);

                            getEventsAsync({
                                offset: (page - 1) * pageSize,
                                quantity: pageSize,
                                level: eventsLevel,
                                rangeDate: rangeDate,
                                userName: userName,
                                objectName: objectName,
                            });
                        },
                    }}
                >
                    <Table.Column
                        render={(_, e: ProductionEventDTO) => {
                            if (
                                e.eventType.eventLevel ===
                                EventLevel.Information
                            ) {
                                return (
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            handleLevelChanged(
                                                e.eventType.eventLevel
                                            )
                                        }
                                    >
                                        <Badge status="warning"></Badge>
                                    </Button>
                                );
                            }

                            if (
                                e.eventType.eventLevel === EventLevel.Accident
                            ) {
                                return (
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            handleLevelChanged(
                                                e.eventType.eventLevel
                                            )
                                        }
                                    >
                                        <Badge status="error"></Badge>
                                    </Button>
                                );
                            }

                            if (
                                e.eventType.eventLevel === EventLevel.Settings
                            ) {
                                return (
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            handleLevelChanged(
                                                e.eventType.eventLevel
                                            )
                                        }
                                    >
                                        <Badge status="success"></Badge>
                                    </Button>
                                );
                            }

                            if (
                                e.eventType.eventLevel ===
                                EventLevel.SystemError
                            ) {
                                return (
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            handleLevelChanged(
                                                e.eventType.eventLevel
                                            )
                                        }
                                    >
                                        <Badge status="error"></Badge>
                                    </Button>
                                );
                            }
                        }}
                    ></Table.Column>
                    <Table.Column
                        title="Дата события"
                        render={(_, e: ProductionEventDTO) => (
                            <Typography.Text className=" whitespace-pre-wrap">
                                {dayjs(e.appearanceDateTime).format(
                                    "DD.MM.YYYY HH:mm:ss"
                                )}
                            </Typography.Text>
                        )}
                    ></Table.Column>
                    <Table.Column
                        title="Имя"
                        render={(_, e: ProductionEventDTO) => (
                            <Tooltip
                                title="Нажмите на поле, чтобы увидеть все изменения связанные с этим объектом"
                                color="geekblue"
                            >
                                <Typography.Link
                                    className=" whitespace-pre-wrap"
                                    onClick={() =>
                                        handleObjectNameChanged(e.object.name)
                                    }
                                >
                                    <strong>{e.object.name}</strong>
                                </Typography.Link>
                            </Tooltip>
                        )}
                    ></Table.Column>
                    <Table.Column
                        title="Описание"
                        render={(_, e: ProductionEventDTO) => (
                            <Typography.Text className=" whitespace-pre-wrap">
                                {e.eventType.description}
                            </Typography.Text>
                        )}
                    ></Table.Column>
                    <Table.Column
                        title="Старое значение"
                        render={(_, e: ProductionEventDTO) => (
                            <Typography.Text className=" whitespace-pre-wrap">
                                {e.valueBefore}
                            </Typography.Text>
                        )}
                    ></Table.Column>
                    <Table.Column
                        title="Новое значение"
                        render={(_, e: ProductionEventDTO) => (
                            <Typography.Text className=" whitespace-pre-wrap">
                                {e.valueAfter}
                            </Typography.Text>
                        )}
                    ></Table.Column>
                    <Table.Column
                        title="Пользователь"
                        render={(_, e: ProductionEventDTO) => (
                            <Typography.Link
                                className=" whitespace-pre-wrap"
                                onClick={() =>
                                    handleUserNameChanged(e.user.name)
                                }
                            >
                                <Tooltip
                                    title="Нажмите на поле, чтобы увидеть все изменения связанные с этим пользователем"
                                    color="geekblue"
                                >
                                    <strong>{e.user.name}</strong>
                                </Tooltip>
                            </Typography.Link>
                        )}
                    ></Table.Column>
                </Table>
            </Card>
        </div>
    );
};
