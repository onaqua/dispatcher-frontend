import { Badge, Card, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import QueueApplicationDTO, {
    ApplicationStatus,
} from "../entities/Application";

export const QueuePanel: React.FC = () => {
    const [queueApplications, setQueueApplications] = useState<
        Array<QueueApplicationDTO>
    >([]);

    useEffect(() => {
        const application1: QueueApplicationDTO = {
            id: 1,
            recipe: "Тестовый рецепт - 1",
            mixerNumber: 1,
            volume: 2.8,
            status: {
                currentStatus: "completed",
                currentProgress: 100,
            },
        };

        const application2: QueueApplicationDTO = {
            id: 1,
            recipe: "Тестовый рецепт - 2",
            mixerNumber: 1,
            volume: 2.8,
            status: {
                currentStatus: "inProcess",
                currentProgress: 100,
            },
        };

        const application3: QueueApplicationDTO = {
            id: 1,
            recipe: "Тестовый рецепт - 3",
            mixerNumber: 1,
            volume: 2.8,
            status: {
                currentStatus: "wait",
                currentProgress: 50,
            },
        };

        setQueueApplications([application1, application2, application3]);
    }, []);

    return (
        <Card className=" w-full max-h-full h-full">
            <Table dataSource={queueApplications} size="small" className=" max-h-full h-full min-h-96">
                <Table.Column title="№" dataIndex="id"></Table.Column>
                <Table.Column title="Рецепт" dataIndex="recipe"></Table.Column>
                <Table.Column title="Объём" dataIndex="volume"></Table.Column>
                <Table.Column
                    title="Состояние"
                    dataIndex="status"
                    render={(s) => {
                        const status = s as ApplicationStatus;

                        if (status.currentStatus === "completed") {
                            return (
                                <Tooltip title="Заявка успешно выполнена">
                                    <Badge color="green" />
                                </Tooltip>
                            );
                        }

                        if (status.currentStatus === "inProcess") {
                            return (
                                <Tooltip title="Заявка выполняется оператором ФИО / Юзернейм аккаунта">
                                    <Badge color="blue" />
                                </Tooltip>
                            );
                        }

                        if (status.currentStatus === "wait") {
                            return (
                                <Tooltip title="Заявка в ожидании на выполнение">
                                    <Badge color="yellow" />
                                </Tooltip>
                            );
                        }
                    }}
                ></Table.Column>
            </Table>
        </Card>
    );
};

export default QueuePanel;
