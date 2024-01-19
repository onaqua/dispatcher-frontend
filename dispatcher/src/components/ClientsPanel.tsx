import { Button, Card, Divider, Input, Select, Typography } from "antd";
import { ChangeEvent, useState } from "react";

export const ClientsPanel: React.FC = () => {
    const [invoice, setInvoice] = useState("");

    function handleInvoiceChanged(event: ChangeEvent<HTMLInputElement>): void {
        setInvoice(event.target.value);
    }

    return (
        <Card className=" w-full h-full min-h-32">
            <div className=" w-full space-y-3 min-h-32">
                <Input
                    value={invoice}
                    onChange={handleInvoiceChanged}
                    size="small"
                    placeholder="Введите номер накладной"
                    className=" w-full"
                />

                <div className=" w-full flex space-x-2 min-h-10">
                    <Button type="primary" size="small">
                        Клиенты
                    </Button>

                    <Select
                        showSearch
                        size="small"
                        placeholder="Введите имя клиента для поиска"
                        className=" w-full"
                    ></Select>
                </div>

                <Divider />

                <div className="w-full text-center">
                    <Typography.Text className="w-full text-zinc-400">
                        Не можете найти нужного клиента? Попробуйте создать его
                        нажав по кнопке ниже
                        <br />
                        <Typography.Link>
                            <strong>Создать клиента</strong>
                        </Typography.Link>
                    </Typography.Text>
                </div>
            </div>
        </Card>
    );
};

export default ClientsPanel;
