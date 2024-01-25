import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    InputNumber,
    Row,
    Segmented,
    Select,
    Space,
    Spin,
    Table,
    Tooltip,
    Typography,
    message,
} from "antd";
import { DefaultOptionType } from "antd/es/select";
import { ChangeEvent, useState } from "react";
import { useMutation } from "react-query";
import ProductionRecipeDTO from "../entities/ProductionRecipeDTO";
import {
    ApplicationsService,
    RecipesService,
} from "../services/AuthorizationService";
import { ApiError } from "../services/core/ApiError";
import { AddApplicationInPreQueueRequest } from "../services/requests/LoginRequest";
import {
    setMixer,
    setRecipe,
    setVolume,
} from "../store/reducers/dispatcherSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { SegmentedValue } from "antd/es/segmented";

export const RecipesPanel: React.FC = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<Array<DefaultOptionType>>([]);

    const carId = useSelector((state: RootState) => state.dispatcher.carId);
    const mixer = useSelector((state: RootState) => state.dispatcher.mixer);
    const volume = useSelector((state: RootState) => state.dispatcher.volume);
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);
    const recipeId = useSelector(
        (state: RootState) => state.dispatcher.recipeId
    );
    const clientId = useSelector(
        (state: RootState) => state.dispatcher.clientId
    );

    const {
        isLoading: isRecipesLoading,
        isError,
        mutateAsync: searchRecipesAsync,
    } = useMutation<Array<ProductionRecipeDTO>, ApiError>(
        () => RecipesService.SearchAsync(query, 0, 5),
        {
            onSuccess(data) {
                const options = data.map<DefaultOptionType>((recipe) => ({
                    value: recipe.id,
                    label: recipe.name,
                }));

                setOptions(options);
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const {
        isLoading: isApplicationLoading,
        mutateAsync: addApplicationInPreQueueAsync,
    } = useMutation<void, ApiError, AddApplicationInPreQueueRequest>(
        (request) => ApplicationsService.AddInPreQueueAsync(request),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const handleAddApplication = async () => {
        const request: AddApplicationInPreQueueRequest = {
            carId: carId!,
            clientId: clientId!,
            recipeId: recipeId!,
            volume: volume!,
            invoice: invoice!,
            isQuickApplication: true,
            mixerNumber: mixer!,
        };

        await addApplicationInPreQueueAsync(request);
    };

    const handleSearchChanged = async (query: string) => {
        setQuery(query);

        await searchRecipesAsync();
    };

    const handleSelect = async (recipeId: number) => {
        dispatch(setRecipe(recipeId));
    };

    const handleVolumeChanged = (value: number | null) => {
        if (value) {
            dispatch(setVolume(value));
        }
    };

    const handleMixerChanged = (value: SegmentedValue) => {
        dispatch(setMixer(value.valueOf() as number));
    };

    return (
        <>
            <Card className="w-full h-full">
                <Spin spinning={isApplicationLoading}>
                    <div className="space-y-3 w-full">
                        <Select
                            showSearch
                            size="small"
                            className="w-full"
                            options={options}
                            loading={isRecipesLoading}
                            searchValue={query}
                            onSelect={handleSelect}
                            onSearch={handleSearchChanged}
                            onFocus={() => handleSearchChanged("")}
                            placeholder="Введите название рецепта"
                        />

                        <Select
                            showSearch
                            size="small"
                            className="w-full"
                            placeholder="Выберите категорию рецепта"
                        />

                        <Row>
                            <Col xs={24} xl={12} xxl={12}>
                                <Checkbox className="w-full">
                                    Учитывать материал в бункерах
                                </Checkbox>
                            </Col>
                            <Col xs={24} xl={12} xxl={12}>
                                <Checkbox className="w-full">
                                    Быстрая заявка
                                </Checkbox>
                            </Col>
                        </Row>

                        <Table>
                            <Table.Column
                                title="№"
                                dataIndex="id"
                            ></Table.Column>
                            <Table.Column
                                title="Название"
                                dataIndex="name"
                            ></Table.Column>
                        </Table>

                        <div className="min-h-14">
                            <Row>
                                <Col xs={24} xl={12}>
                                    <div className=" w-full flex space-x-2 items-center">
                                        <Typography.Text>
                                            Смеситель:{" "}
                                        </Typography.Text>
                                        <Segmented
                                            onChange={handleMixerChanged}
                                            defaultValue={mixer}
                                            options={[1, 2, 3]}
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} xl={12}>
                                    <div className=" w-full flex space-x-2 items-center">
                                        <Typography.Text className="w-full">
                                            Объём:{" "}
                                        </Typography.Text>
                                        <InputNumber
                                            min={0}
                                            onChange={handleVolumeChanged}
                                            defaultValue={volume}
                                            value={volume}
                                            placeholder="Объём"
                                            className="w-full"
                                        ></InputNumber>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <Divider />

                        <div className="w-full text-right">
                            <Tooltip title="После нажатия на кнопку, созданная вами заявка отправится в предварительную очередь.">
                                <Button
                                    type="primary"
                                    onClick={handleAddApplication}
                                >
                                    Создать заявку
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Spin>
            </Card>
        </>
    );
};

export default RecipesPanel;
