import
    {
        Button,
        Card,
        Checkbox,
        Col,
        Input,
        InputNumber,
        List,
        Row,
        Segmented,
        Select,
        Space,
        Typography,
        message,
    } from "antd";
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
import
    {
        setCategory,
        setMixer,
        setQuickApplication,
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

    const carId = useSelector((state: RootState) => state.dispatcher.carId);
    const mixer = useSelector((state: RootState) => state.dispatcher.mixer);
    const volume = useSelector((state: RootState) => state.dispatcher.volume);
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);
    const isQuickApplication = useSelector(
        (state: RootState) => state.dispatcher.isQuickApplication
    );

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

        console.log("application add request:", request);

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
        await searchCategoriesAsync({
            query: query,
            page: 1,
            pageSize: 5,
        });
    };

    const handleQuickApplicationChanged = async (value: boolean) => {
        dispatch(setQuickApplication(value));
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
            <Card title="Панель рецептов">
                <Space className="mb-2 w-full" direction="vertical" size={24}>
                    <Row gutter={[32, 16]}>
                        <Col span={12}>
                            <Select
                                showSearch
                                placeholder="Выберите категорию рецепта"
                                options={categories}
                                onSearch={handleSearchCategoriesChanged}
                                onFocus={() =>
                                    handleSearchCategoriesChanged("")
                                }
                                onSelect={(_, v) =>
                                    handleCategorySelected(v.data)
                                }
                                className=" w-full"
                            ></Select>
                        </Col>

                        <Col span={12}>
                            <Input.Search
                                value={recipesQuery}
                                onChange={({ target }) =>
                                    handleSearchRecipesChanged(target.value)
                                }
                                placeholder="Введите название рецепта для поиска"
                            ></Input.Search>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <List
                                className="mt-4 min-h-80"
                                dataSource={recipes.items}
                                rootClassName="min-h-80"
                                pagination={{
                                    pageSize: 5,
                                    current: currentPage,
                                    total: recipes.totalItems,
                                    className: "flex justify-center bottom-0",
                                    onChange: handlePageChanged,
                                }}
                                renderItem={(recipe) => (
                                    <List.Item
                                        className="cursor-pointer w-full"
                                        onClick={() =>
                                            handleSelectRecipe(recipe.id)
                                        }
                                    >
                                        <div className=" flex items-center justify-between w-full space-x-4">
                                            <Checkbox
                                                title="Выбрать"
                                                checked={recipeId == recipe.id}
                                            ></Checkbox>
                                            <List.Item.Meta
                                                title={
                                                    <Typography.Link>
                                                        {recipe.name}
                                                    </Typography.Link>
                                                }
                                            />
                                        </div>
                                    </List.Item>
                                )}
                            ></List>
                        </Col>
                    </Row>

                    <Row gutter={[36, 16]}>
                        {mixers && mixers.length && (
                            <Col xxl={12} xl={12} md={12} xs={24} lg={24}>
                                <Segmented
                                    className=" w-full"
                                    defaultChecked={true}
                                    defaultValue={mixers[0].number}
                                    title="Выберите миксер"
                                    value={mixer}
                                    placeholder="Выберите миксер"
                                    options={mixers.map((e) => ({
                                        label: `${e.number}-й смеситель`,
                                        value: e.number,
                                    }))}
                                    onChange={handleMixerChanged}
                                ></Segmented>
                            </Col>
                        )}

                        <Col xxl={12} xl={12} md={12} xs={24} lg={24}>
                            <InputNumber
                                onChange={handleVolumeChanged}
                                placeholder="Введите объём заявки"
                                className=" w-full"
                            ></InputNumber>
                        </Col>
                    </Row>

                    <Row gutter={[32, 16]}>
                        <Col xxl={12} xl={12} md={12} xs={24} lg={24}>
                            <Checkbox
                                value={isQuickApplication}
                                onChange={(e) =>
                                    handleQuickApplicationChanged(
                                        e.target.checked
                                    )
                                }
                            >
                                Быстрая заявка
                            </Checkbox>
                        </Col>

                        <Col
                            xxl={12}
                            xl={12}
                            md={12}
                            xs={24}
                            lg={24}
                            className=" right-0 flex justify-end"
                        >
                            <Button
                                type="primary"
                                loading={isApplicationLoading}
                                onClick={handleAddApplication}
                                className="right-0"
                            >
                                Создать заявку
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </Card>
        </>
    );
};

export default RecipesPanel;
