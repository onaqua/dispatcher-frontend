import {
    Button,
    Card,
    Divider,
    Input,
    Select,
    Typography,
    message,
} from "antd";
import { DefaultOptionType } from "antd/es/select";
import { ChangeEvent, useState } from "react";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import { ApiError } from "../services/core/ApiError";
import { ClientsService } from "../services/AuthorizationService";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setClient, setInvoice } from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";

export const ClientsPanel: React.FC = () => {
    const dispatch = useDispatch();
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<Array<DefaultOptionType>>([]);

    const { isLoading, isError, mutateAsync: searchCarsAsync } = useMutation<
        Array<ProductionClientDTO>,
        ApiError
    >(() => ClientsService.SearchAsync(query, 0, 5), {
        onSuccess(data) {
            const options = data.map<DefaultOptionType>((car) => ({
                value: car.id,
                label: car.name,
            }));

            setOptions(options);
        },
        onError(error) {
            message.error(error.body.Details);
        },
    });

    const handleSearchChanged = async (query: string) => {
        setQuery(query);

        await searchCarsAsync();
    };

    const handleSelect = async (clientId: number) => {
        dispatch(setClient(clientId));
    };

    function handleInvoiceChanged(event: ChangeEvent<HTMLInputElement>): void {
        dispatch(setInvoice(event.target.value));
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
                        options={options}
                        loading={isLoading}
                        searchValue={query}
                        onSearch={handleSearchChanged}
                        onSelect={(e) => handleSelect(e)}
                        onFocus={() => handleSearchChanged("")}
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
