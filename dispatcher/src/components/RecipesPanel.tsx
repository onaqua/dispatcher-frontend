import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Input,
    InputNumber,
    Row,
    Segmented,
    Select,
    Spin,
    Table,
    Tooltip,
    Typography,
    message,
} from "antd";
import DisabledContext from "antd/es/config-provider/DisabledContext";
import { SegmentedValue } from "antd/es/segmented";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { PagedList } from "../entities/PagedList";
import { ProductionCategoryDTO } from "../entities/ProductionCategoryDTO";
import ProductionRecipeDTO, {
    ProductionMixerDTO,
} from "../entities/ProductionRecipeDTO";
import { ApplicationsService } from "../services/ApplicationsService";
import { CategoriesService } from "../services/CategoriesService";
import { MixersService } from "../services/MixersService";
import { RecipesService } from "../services/RecipesService";
import { ApiError } from "../services/core/ApiError";
import { AddApplicationInPreQueueRequest } from "../services/requests/LoginRequest";
import {
    setCategory,
    setMixer,
    setRecipe,
    setVolume,
} from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";
import { PaginationProps } from "../types/PaginationProps";
import { TypedOption } from "../types/TypedOption";

type RecipeOption = {
    id: number;
    name: string;
};

interface RecipesPaginationProps extends PaginationProps {
    categoryId: number;
}

export const RecipesPanel: React.FC = () => {
    const dispatch = useDispatch();
    const [recipesQuery, setRecipesQuery] = useState("");
    const [categoriesQuery, setCategoriesQuery] = useState("");

    const carId = useSelector((state: RootState) => state.dispatcher.carId);
    const mixer = useSelector((state: RootState) => state.dispatcher.mixer);
    const volume = useSelector((state: RootState) => state.dispatcher.volume);
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);

    const [mixers, setMixers] = useState<Array<ProductionMixerDTO>>([]);

    const recipeId = useSelector(
        (state: RootState) => state.dispatcher.recipeId
    );

    const categoryId = useSelector(
        (state: RootState) => state.dispatcher.categoryId
    );

    const clientId = useSelector(
        (state: RootState) => state.dispatcher.clientId
    );

    const [recipes, setRecipes] = useState<PagedList<RecipeOption>>({
        items: [],
        totalItems: 0,
    });

    const [categories, setCategories] = useState<
        Array<TypedOption<ProductionCategoryDTO>>
    >([]);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const {
        isLoading: isRecipesLoading,
        isError: isRecipesLoadingError,
        mutateAsync: searchRecipesAsync,
    } = useMutation<
        PagedList<ProductionRecipeDTO>,
        ApiError,
        RecipesPaginationProps
    >(
        (pagination) =>
            RecipesService.SearchAsync(
                pagination.categoryId,
                pagination.query,
                pagination.pageSize * (pagination.page - 1),
                pagination.pageSize
            ),
        {
            onSuccess(fetchedRecipes) {
                const options = fetchedRecipes.items.map<RecipeOption>(
                    (recipe) => ({
                        id: recipe.id,
                        value: recipe.id,
                        name: recipe.name,
                    })
                );

                const pagedList: PagedList<RecipeOption> = {
                    items: options,
                    totalItems: fetchedRecipes.totalItems,
                };

                setRecipes(pagedList);
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const {
        isLoading: isCategoriesLoading,
        isError: isCategoriesLoadingError,
        mutateAsync: searchCategoriesAsync,
    } = useMutation<
        PagedList<ProductionCategoryDTO>,
        ApiError,
        PaginationProps
    >(
        (pagination) =>
            CategoriesService.SearchAsync(
                pagination.query,
                pagination.pageSize * (pagination.page - 1),
                pagination.pageSize
            ),
        {
            onSuccess(fetchedCategories) {
                const options = fetchedCategories.items.map<
                    TypedOption<ProductionCategoryDTO>
                >((category) => ({
                    value: category.name,
                    label: category.name,
                    data: category,
                }));

                setCategories(options);
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const {
        isLoading: isMixersLoading,
        isError: isMixersLoadingError,
        mutateAsync: getMixersAsync,
    } = useMutation<Array<ProductionMixerDTO>, ApiError>(
        () => MixersService.GetAsync(),
        {
            onSuccess(fetchedMixers) {
                setMixers(fetchedMixers);
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

    const handleSelectRecipe = (recipeId: number) => {
        dispatch(setRecipe(recipeId));
    };

    const handlePageChanged = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        searchRecipesAsync({
            categoryId,
            query: recipesQuery,
            page: pageNumber,
            pageSize: 5,
        });
    };

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

    const handleSearchRecipesChanged = async (query: string) => {
        setRecipesQuery(query);

        await searchRecipesAsync({
            categoryId,
            query: query,
            page: currentPage,
            pageSize: 5,
        });
    };

    const handleSearchCategoriesChanged = async (query: string) => {
        setCategoriesQuery(query);

        await searchCategoriesAsync({
            query: query,
            page: 1,
            pageSize: 5,
        });
    };

    const handleCategorySelected = async (category: ProductionCategoryDTO) => {
        dispatch(setCategory(category.id));

        await searchRecipesAsync({
            categoryId: category.id,
            query: recipesQuery,
            page: currentPage,
            pageSize: 5,
        });
    };

    const isMixersAvailable = (): boolean => {
        return mixers && mixers.length > 0;
    };

    const isApplicationCanStart = () => {
        const isCategorySelected = categoryId !== -1;
        const isRecipeSelected = recipeId !== 0;
        const isVolumeSelected = volume !== 0;
        const isMixerSelected = mixer !== 0;

        return (
            isMixersAvailable() &&
            isCategorySelected &&
            isRecipeSelected &&
            isVolumeSelected &&
            isMixerSelected
        );
    };

    const isCategorySelected = () => {
        return categoryId !== -1;
    };

    const handleVolumeChanged = (value: number | null) => {
        if (value) {
            dispatch(setVolume(value));
        }
    };

    const handleMixerChanged = (value: SegmentedValue) => {
        dispatch(setMixer(value.valueOf() as number));
    };

    useEffect(() => {
        getMixersAsync();
    }, []);

    return (
        <>
            <Card className="w-full h-full" id="recipes-card">
                <Spin spinning={isApplicationLoading} className=" h-full">
                    <div className="space-y-3 w-full h-full">
                        <Select
                            showSearch
                            size="small"
                            className="w-full"
                            id="category-select"
                            options={categories}
                            onFocus={(_) => handleSearchCategoriesChanged("")}
                            onSearch={handleSearchCategoriesChanged}
                            onSelect={(
                                _,
                                e: TypedOption<ProductionCategoryDTO>
                            ) => handleCategorySelected(e.data)}
                            placeholder="Введите название категории рецепта для поиска"
                        />

                        <DisabledContext.Provider value={!isCategorySelected()}>
                            <Input
                                size="small"
                                id="recipe-search"
                                className="w-full"
                                value={recipesQuery}
                                onChange={(e) =>
                                    handleSearchRecipesChanged(e.target.value)
                                }
                                placeholder="Введите название рецепта для поиска"
                            />

                            <Table
                                id="recipes-table"
                                className=" cursor-pointer h-80"
                                onRow={(recipe) => ({
                                    onClick: () =>
                                        handleSelectRecipe(recipe.id),
                                })}
                                pagination={{
                                    pageSize: 5,
                                    current: currentPage,
                                    total: recipes.totalItems,
                                    onChange: handlePageChanged,
                                }}
                                dataSource={recipes.items}
                                size="small"
                                virtual
                                locale={{ emptyText: "Нет рецептов" }}
                                loading={isRecipesLoading}
                            >
                                <Table.Column
                                    render={(_, e: RecipeOption) => (
                                        <Checkbox checked={e.id === recipeId} />
                                    )}
                                ></Table.Column>
                                <Table.Column
                                    title="Название рецепта"
                                    dataIndex="name"
                                ></Table.Column>
                            </Table>
                            <div className="min-h-14">
                                <Row>
                                    <Col xs={24} xl={8}>
                                        <div
                                            className=" w-full flex space-x-2 items-center"
                                            id="mixer-select"
                                        >
                                            {!isMixersLoading && (
                                                <>
                                                    <Typography.Text>
                                                        Смеситель:{" "}
                                                    </Typography.Text>

                                                    {isMixersAvailable() ? (
                                                        <Segmented
                                                            onChange={
                                                                handleMixerChanged
                                                            }
                                                            defaultValue={
                                                                mixers[0].number
                                                            }
                                                            options={mixers.map(
                                                                (mixer) =>
                                                                    mixer.number
                                                            )}
                                                        />
                                                    ) : (
                                                        <Typography.Text>
                                                            Нет доступных
                                                            смесителей
                                                        </Typography.Text>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Col>

                                    <Col xs={24} xl={8}>
                                        <div
                                            className=" w-full flex space-x-2 items-center"
                                            id="volume-select"
                                        >
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
                        </DisabledContext.Provider>

                        <Divider />

                        <div className="w-full text-right">
                            <Row justify="center">
                                <Col
                                    xs={24}
                                    xl={12}
                                    xxl={12}
                                    id="is-quick-application"
                                >
                                    <Checkbox
                                        className="w-full"
                                        disabled={!isApplicationCanStart()}
                                    >
                                        Быстрая заявка
                                    </Checkbox>
                                </Col>

                                <Col
                                    xs={24}
                                    xl={12}
                                    xxl={12}
                                    id="is-quick-application"
                                >
                                    <Tooltip
                                        color="geekblue"
                                        title="После нажатия на кнопку, созданная вами заявка отправится в предварительную очередь."
                                    >
                                        <Button
                                            id="create-application-button"
                                            type="primary"
                                            disabled={!isApplicationCanStart()}
                                            onClick={handleAddApplication}
                                        >
                                            Создать заявку
                                        </Button>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Spin>
            </Card>
        </>
    );
};

export default RecipesPanel;
