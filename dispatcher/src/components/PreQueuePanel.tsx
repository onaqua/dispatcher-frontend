import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Card, Table, message } from "antd";

import { CSS } from "@dnd-kit/utilities";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { PreQueueApplicationDTO } from "../entities/PreQueueApplicationDTO";

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
    const [applications, setApplications] = useState<
        Array<PreQueueApplicationDTO>
    >([]);

    const [selectedApplication, setSelectedApplication] = useState<
        PreQueueApplicationDTO | undefined
    >();

    const rowSelection = {
        onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: PreQueueApplicationDTO[]
        ) => {
            if (selectedRowKeys && selectedRows.length > 0) {
                setSelectedApplication(selectedRows[0]);
            }
        },
        getCheckboxProps: (record: PreQueueApplicationDTO) => ({
            name: record.recipeName,
        }),
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    );

    const columns: ColumnsType<PreQueueApplicationDTO> = [
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

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setApplications((prev) => {
                const activeIndex = prev.findIndex(
                    (i) => i.order === active.id
                );
                const overIndex = prev.findIndex((i) => i.order === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    useEffect(() => {
        const application1: PreQueueApplicationDTO = {
            recipeName: "Тестовый рецепт",
            mixerNumber: 1,
            applicationId: 1,
            order: "1",
            volume: 3,
        };

        const application2: PreQueueApplicationDTO = {
            recipeName: "Тестовый рецепт",
            mixerNumber: 1,
            applicationId: 2,
            order: "5",
            volume: 3,
        };

        const application3: PreQueueApplicationDTO = {
            recipeName: "Тестовый рецепт",
            mixerNumber: 1,
            applicationId: 3,
            order: "0",
            volume: 3,
        };

        setApplications([application1, application2, application3]);
    }, []);

    function handleSubmitApplication(): void {
        if (selectedApplication === undefined) {
            message.error(
                `Невозможно добавить несуществующую заявку. Выберите заявку из списка, а потом пропробуйте снова.`
            );

            return;
        }

        message.success(
            `Заявка: ${selectedApplication?.applicationId} успешно добавлена в очередь.`
        );
    }

    return (
        <Card className=" w-full h-full">
            <DndContext
                sensors={sensors}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={onDragEnd}
            >
                <SortableContext
                    items={applications.map((i) => i.order)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        className=" "
                        rowSelection={{
                            type: "radio",
                            ...rowSelection,
                        }}
                        size="small"
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        rowKey="order"
                        columns={columns}
                        dataSource={applications}
                    ></Table>
                </SortableContext>
            </DndContext>

            <Button type="primary" onClick={handleSubmitApplication}>
                Отправить заявку
            </Button>
        </Card>
    );
};

export default PreQueuePanel;
