import { Button, Card, Divider, Select, Typography } from "antd";

export const CarsPanel: React.FC = () => {
    return (
        <Card className="w-full h-full min-h-32">
            <div className="space-y-3 w-full min-h-10">
                <div className="flex space-x-2 min-h-10">
                    <Button size="small" type="primary">
                        Машины
                    </Button>
                    <Select
                        showSearch
                        className="w-full"
                        size="small"
                        placeholder="Введите номер машины для поиска"
                    ></Select>
                </div>

                <Divider />

                <div className="w-full text-center min-h-10">
                    <Typography.Text className="w-full text-zinc-400">
                        Не можете найти нужный автомобиль? Попробуйте создать
                        его нажав по кнопке{" "}
                        <Typography.Link>
                            <strong>Управление машинами</strong>
                        </Typography.Link>
                    </Typography.Text>
                </div>
            </div>
        </Card>
    );
};

export default CarsPanel;
