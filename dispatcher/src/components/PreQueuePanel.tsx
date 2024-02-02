import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Card, Table, Tooltip, Typography, message } from "antd";
import { IoArrowDownCircleOutline } from "react-icons/io5";

import { CSS } from "@dnd-kit/utilities";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import {
    ProductionApplicationDTO,
    ProductionLayerDTO,
} from "../entities/ApplicationDTO";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import { ApplicationsService } from "../services/ApplicationsService";
import { ApiError } from "../services/core/ApiError";
import { RootState } from "../store/store";

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

    const [selectedApplication, setSelectedApplication] = useState<
        ProductionApplicationDTO | undefined
    >();

    const rowSelection = {
        onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: ProductionApplicationDTO[]
        ) => {
            if (selectedRowKeys && selectedRows.length > 0) {
                setSelectedApplication(selectedRows[0]);
            }
        },
        getCheckboxProps: (record: ProductionApplicationDTO) => ({
            name: record,
        }),
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    );

    const columns: ColumnsType<ProductionApplicationDTO> = [
        {
            title: "Рецепт",
            dataIndex: "recipeName",
        },
        {
            title: "№",
            dataIndex: "id",
        },
        {
            title: "Объём",
            dataIndex: "volume",
        },
        {
            title: "Смеситель",
            dataIndex: "mixerNumber",
        },
    ];

    const { isLoading, mutateAsync: addApplicationInQueueAsync } = useMutation<
        Array<ProductionApplicationDTO>,
        ApiError,
        number
    >((id) => ApplicationsService.AddInQueueAsync(id), {
        onError(error) {
            message.error(error.body.Details);
        },
    });

    async function handleSubmitApplication(
        applicationId: number
    ): Promise<void> {
        await addApplicationInQueueAsync(applicationId);
    }

    return (
        <Card className="h-full">
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]}>
                <SortableContext
                    items={applications.map((i) => i.order)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className=" overflow-auto">
                        <Table
                            locale={{ emptyText: "Нет заявок" }}
                            rowKey={(record) => record.id}
                            className=" h-full"
                            loading={isLoading}
                            dataSource={applications}
                            pagination={{ pageSize: 4 }}
                            size="small"
                        >
                            <Table.Column
                                title="№"
                                dataIndex="id"
                            ></Table.Column>
                            <Table.Column
                                title="Рецепты"
                                dataIndex="layers"
                                render={(l) => {
                                    const layers = l as Array<
                                        ProductionLayerDTO
                                    >;

                                    const recipes = layers
                                        .map((layer) => layer.recipe.name)
                                        .join(", ");

                                    return (
                                        <Typography.Text>
                                            {recipes}
                                        </Typography.Text>
                                    );
                                }}
                            />

                            <Table.Column
                                title="Объём"
                                className=" break-before-left"
                                dataIndex="volume"
                            ></Table.Column>
                            <Table.Column
                                title="Клиент"
                                className=" break-before-left"
                                dataIndex="client"
                                render={(c) => {
                                    const client = c as ProductionClientDTO;
                                    return (
                                        <Typography.Text>
                                            {client.name}
                                        </Typography.Text>
                                    );
                                }}
                            />
                            <Table.Column
                                title="Машина"
                                className=" break-before-left"
                                dataIndex="car"
                                render={(c) => {
                                    const car = c as ProductionCarDTO;
                                    return (
                                        <Typography.Text>
                                            {car.plateNumber}
                                        </Typography.Text>
                                    );
                                }}
                            />
                            <Table.Column
                                title="Действие"
                                className=" break-before-left"
                                dataIndex="id"
                                render={(id) => {
                                    return (
                                        <Tooltip
                                            title="Отправить заявку на выполнение"
                                            color="geekblue"
                                        >
                                            <Button
                                                size="large"
                                                type="link"
                                                onClick={() =>
                                                    handleSubmitApplication(
                                                        id as number
                                                    )
                                                }
                                                icon={
                                                    <IoArrowDownCircleOutline />
                                                }
                                            ></Button>
                                        </Tooltip>
                                    );
                                }}
                            />
                        </Table>
                    </div>
                </SortableContext>
            </DndContext>
        </Card>
    );
};

export default PreQueuePanel;
