import { Button, Card, Input, Select, message } from "antd";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { DispatcherPermissions } from "../consts/Permissions";
import { Client } from "../entities/Client";
import { PagedList } from "../entities/PagedList";
import { ClientsService } from "../services/ClientsService";
import { PermissionsService } from "../services/PermissionsService";
import { ApiError } from "../services/core/ApiError";
import { setClient, setInvoice } from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";

export const ClientsPanel: React.FC = () => {
    const client = useSelector((state: RootState) => state.dispatcher.client);

    const dispatch = useDispatch();
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);

    const [query, setQuery] = useState("");
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    const { data: clients, isLoading } = useQuery<PagedList<Client>, ApiError>(
        ["searchClients", query],
        () => ClientsService.SearchAsync(query, 1, 5),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const handleSearchChanged = (query: string): void => setQuery(query);
    const handleSelect = (client: Client): any => dispatch(setClient(client));
    const handleInvoiceChanged = (event: ChangeEvent<HTMLInputElement>): any =>
        dispatch(setInvoice(event.target.value));

    return (
        <>
            {/* <CreateClientDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onOk={() => setDialogOpen(false)}
            /> */}

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
                            options={clients?.items}
                            loading={isLoading}
                            defaultValue={client?.name}
                            searchValue={query}
                            fieldNames={{ label: "name", value: "name" }}
                            onSearch={handleSearchChanged}
                            onSelect={(_, e) => handleSelect(e)}
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
