import { Button, Card, Select, message } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Car } from "../entities/Car";
import { PagedList } from "../entities/PagedList";
import { CarsService } from "../services/CarsService";
import { ApiError } from "../services/core/ApiError";
import { setCar } from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";

export const CarsPanel: React.FC = () => {
    const dispatch = useDispatch();

    const selectedCar = useSelector((root: RootState) => root.dispatcher.car);

    const [query, setQuery] = useState("");

    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    const { data: cars, isLoading } = useQuery<PagedList<Car>, ApiError>(
        ["searchCars", query],
        () => CarsService.SearchAsync(query, 1, 5),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const handleSearchChanged = (query: string) => setQuery(query);
    const handleSelect = async (car: Car) => dispatch(setCar(car));

    return (
        <>
            {/* <CreateCarDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onOk={() => setDialogOpen(false)}
            /> */}
            <Card title="Панель автомобилей">
                <div className="flex space-x-2">
                    <Button type="dashed" onClick={() => setDialogOpen(true)}>
                        Все машины
                    </Button>
                    <Select
                        showSearch
                        className="w-full"
                        defaultValue={selectedCar.name}
                        fieldNames={{ label: "name", value: "name" }}
                        placeholder="Введите номер"
                        options={cars?.items}
                        loading={isLoading}
                        searchValue={query}
                        onSearch={handleSearchChanged}
                        onSelect={(_, e) => handleSelect(e)}
                        onFocus={() => handleSearchChanged("")}
                    ></Select>
                </div>
            </Card>
        </>
    );
};

export default CarsPanel;
