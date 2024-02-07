import { Button, Card, Select, message } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { CreateCarDialog } from "../dialogs/CarsDialogs";
import { PagedList } from "../entities/PagedList";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import { CarsService } from "../services/CarsService";
import { ApiError } from "../services/core/ApiError";
import { setCar } from "../store/reducers/dispatcherSlice";
import { PaginationProps } from "../types/PaginationProps";
import { TypedOption } from "../types/TypedOption";

export const CarsPanel: React.FC = () => {
    const dispatch = useDispatch();

    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<
        Array<TypedOption<ProductionCarDTO>>
    >([]);

    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    const { isLoading, mutateAsync: searchCarsAsync } = useMutation<
        PagedList<ProductionCarDTO>,
        ApiError,
        PaginationProps
    >(
        (pagination) =>
            CarsService.SearchAsync(
                pagination.query,
                (pagination.page - 1) * pagination.pageSize,
                pagination.pageSize
            ),
        {
            onSuccess(data) {
                const fetchedOptions = data.items.map<
                    TypedOption<ProductionCarDTO>
                >((car) => ({
                    value: car.id,
                    label: car.plateNumber,
                    data: car,
                }));

                setOptions(fetchedOptions);
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const handleSearchChanged = (query: string) => {
        setQuery(query);

        searchCarsAsync({ query: query, page: 1, pageSize: 5 });
    };

    const handleSelect = async (car: ProductionCarDTO) => {
        console.log("selected car:", car);
        dispatch(setCar(car.id));
    };

    return (
        <>
            <CreateCarDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onOk={() => setDialogOpen(false)}
            />
            <Card className=" h-full" title="Панель автомобилей">
                <div className="flex space-x-2">
                    <Button type="dashed" onClick={() => setDialogOpen(true)}>
                        Все машины
                    </Button>
                    <Select
                        showSearch
                        className="w-full"
                        placeholder="Введите номер"
                        options={options}
                        loading={isLoading}
                        searchValue={query}
                        onSearch={handleSearchChanged}
                        onSelect={(_, e) => handleSelect(e.data)}
                        onFocus={() => handleSearchChanged("")}
                    ></Select>
                </div>
            </Card>
        </>
    );
};

export default CarsPanel;
