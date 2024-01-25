import { Button, Card, Divider, Select, Typography, message } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useState } from "react";
import { useMutation } from "react-query";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import { CarsService } from "../services/AuthorizationService";
import { ApiError } from "../services/core/ApiError";
import { useDispatch } from "react-redux";
import { setCar } from "../store/reducers/dispatcherSlice";

export const CarsPanel: React.FC = () => {
    const dispatch = useDispatch();

    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<Array<DefaultOptionType>>([]);

    const { isLoading, isError, mutateAsync: searchCarsAsync } = useMutation<
        Array<ProductionCarDTO>,
        ApiError
    >(() => CarsService.SearchAsync(query, 0, 5), {
        onSuccess(data) {
            const options = data.map<DefaultOptionType>((car) => ({
                value: car.id,
                label: car.plateNumber,
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

    const handleSelect = async (carId: number) => {
        dispatch(setCar(carId));
    };

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
                        options={options}
                        loading={isLoading}
                        searchValue={query}
                        onSelect={(e) => handleSelect(e)}
                        onSearch={handleSearchChanged}
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
