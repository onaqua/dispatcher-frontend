import { Button, Select, message } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { PagedList } from "../entities/PagedList";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import { CarsService } from "../services/CarsService";
import { ApiError } from "../services/core/ApiError";
import { setCar } from "../store/reducers/dispatcherSlice";
import { PaginationProps } from "../types/PaginationProps";
import { TypedOption } from "../types/TypedOption";
import { PermissionsService } from "../services/PermissionsService";
import { DispatcherPermissions } from "../consts/Permissions";

export const CarsPanel: React.FC = () => {
    const dispatch = useDispatch();

    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<
        Array<TypedOption<ProductionCarDTO>>
    >([]);

    const { isLoading, isError, mutateAsync: searchCarsAsync } = useMutation<
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
                    value: car.plateNumber,
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
        dispatch(setCar(car.id));
    };

    return (
        <>
            <div className="space-x-2 flex w-full">
                {PermissionsService.hasPermission(
                    DispatcherPermissions.CarsCreate
                ) && (
                    <Button size="small" type="primary">
                        Машины
                    </Button>
                )}
                <Select
                    showSearch
                    className="w-full"
                    size="small"
                    id="car-input"
                    options={options}
                    loading={isLoading}
                    searchValue={query}
                    onSelect={(_, e) => handleSelect(e.data)}
                    onSearch={handleSearchChanged}
                    onFocus={(_) => handleSearchChanged("")}
                    placeholder="Введите номер машины для поиска"
                ></Select>
            </div>
        </>
    );
};

export default CarsPanel;
