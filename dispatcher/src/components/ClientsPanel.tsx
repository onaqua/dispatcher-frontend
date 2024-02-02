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
import { ClientsService } from "../services/ClientsService";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setClient, setInvoice } from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";
import { PagedList } from "../entities/PagedList";
import { TypedOption } from "../types/TypedOption";
import { PermissionsService } from "../services/PermissionsService";
import { DispatcherPermissions } from "../consts/Permissions";

export const ClientsPanel: React.FC = () => {
    const dispatch = useDispatch();
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<
        Array<TypedOption<ProductionClientDTO>>
    >([]);

    const { isLoading, isError, mutateAsync: searchCarsAsync } = useMutation<
        PagedList<ProductionClientDTO>,
        ApiError
    >(() => ClientsService.SearchAsync(query, 0, 5), {
        onSuccess(data) {
            const options = data.items.map<TypedOption<ProductionClientDTO>>(
                (car) => ({
                    value: car.name,
                    label: car.name,
                    data: car,
                })
            );

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

    const handleSelect = async (client: ProductionClientDTO) => {
        dispatch(setClient(client.id));
    };

    function handleInvoiceChanged(event: ChangeEvent<HTMLInputElement>): void {
        dispatch(setInvoice(event.target.value));
    }

    return (
        <>
            <div className=" w-full space-y-2">
                <Input
                    value={invoice}
                    onChange={handleInvoiceChanged}
                    size="small"
                    id="invoice-input"
                    placeholder="Введите номер накладной"
                    className=" w-full"
                />

                <div className=" w-full space-x-2 flex">
                    {PermissionsService.hasPermission(
                        DispatcherPermissions.ClientsCreate
                    ) && (
                        <Button type="primary" size="small">
                            Клиенты
                        </Button>
                    )}

                    <Select
                        showSearch
                        id="client-input"
                        size="small"
                        placeholder="Введите имя клиента для поиска"
                        options={options}
                        loading={isLoading}
                        searchValue={query}
                        onSearch={handleSearchChanged}
                        onSelect={(_, e) => handleSelect(e.data)}
                        onFocus={() => handleSearchChanged("")}
                        className=" w-full"
                    ></Select>
                </div>
            </div>
        </>
    );
};

export default ClientsPanel;
