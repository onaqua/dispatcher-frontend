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
import { CreateClientDialog } from "../dialogs/ClientsDialog";

export const ClientsPanel: React.FC = () => {
    const dispatch = useDispatch();
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<
        Array<TypedOption<ProductionClientDTO>>
    >([]);

    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const { isLoading, isError, mutateAsync: searchCarsAsync } = useMutation<
        PagedList<ProductionClientDTO>,
        ApiError
    >(() => ClientsService.SearchAsync(query, 0, 5), {
        onSuccess(data) {
            const options = data.items.map<TypedOption<ProductionClientDTO>>(
                (car) => ({
                    value: car.id,
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
            <CreateClientDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onOk={() => setDialogOpen(false)}
            />

            <Card className=" h-full" title="Панель клиентов">
                <div className=" h-full w-full space-y-2">
                    <Input
                        value={invoice}
                        onChange={handleInvoiceChanged}
                        id="invoice-input"
                        placeholder="Введите номер накладной"
                        className=" w-full"
                    />

                    <div className=" w-full space-x-2 flex">
                        {PermissionsService.hasPermission(
                            DispatcherPermissions.ClientsCreate
                        ) && (
                            <Button
                                type="dashed"
                                onClick={() => setDialogOpen(true)}
                            >
                                Все клиенты
                            </Button>
                        )}

                        <Select
                            showSearch
                            id="client-input"
                            placeholder="Введите имя"
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
            </Card>
        </>
    );
};

export default ClientsPanel;
