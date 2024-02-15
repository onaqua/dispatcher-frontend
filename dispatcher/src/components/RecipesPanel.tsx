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
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmApplicationDialog } from "../dialogs/ConfirmApplicationDialog";
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
import { TypedOption } from "../types/TypedOption";

type RecipeOption = {
    id: number;
    name: string;
};

export const RecipesPanel: React.FC = () => {
    const dispatch = useDispatch();
    const [recipesQuery, setRecipesQuery] = useState("");
    const [categoriesQuery, setCategoriesQuery] = useState("");

    const car = useSelector((state: RootState) => state.dispatcher.car);
    const mixer = useSelector((state: RootState) => state.dispatcher.mixer);
    const volume = useSelector((state: RootState) => state.dispatcher.volume);
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);
    const isQuickApplication = useSelector(
        (state: RootState) => state.dispatcher.isQuickApplication
    );

    const [mixers, setMixers] = useState<Array<ProductionMixerDTO>>([]);

    const [applicationDialogOpen, setApplicationDialogOpen] = useState<boolean>(
        false
    );

    const recipeId = useSelector(
        (state: RootState) => state.dispatcher.recipeId
    );

    const category = useSelector(
        (state: RootState) => state.dispatcher.category
    );

    const client = useSelector((state: RootState) => state.dispatcher.client);

    const [recipes, setRecipes] = useState<PagedList<RecipeOption>>({
        items: [],
        totalItems: 0,
    });

    const [categories, setCategories] = useState<
        Array<TypedOption<ProductionCategoryDTO>>
    >([]);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const {} = useQuery<PagedList<ProductionRecipeDTO>, ApiError>(
        ["recipes", currentPage, recipesQuery, category],
        () =>
            RecipesService.SearchAsync(
                category.id,
                recipesQuery,
                5 * (currentPage - 1),
                5
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

    const {} = useQuery<PagedList<ProductionCategoryDTO>, ApiError>(
        ["categories", categoriesQuery],
        () => CategoriesService.SearchAsync(categoriesQuery, 0, 5),
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

    const {} = useQuery<Array<ProductionMixerDTO>, ApiError>(
        "mixers",
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
            onSuccess: () => setApplicationDialogOpen(false),
        }
    );

    const handleSelectRecipe = (recipeId: number) => {
        dispatch(setRecipe(recipeId));
    };

    const handlePageChanged = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleAddApplication = async () => {
        const request: AddApplicationInPreQueueRequest = {
            carId: car.id!,
            clientId: client?.id!,
            recipeId: recipeId!,
            volume: volume!,
            invoice: invoice!,
            isQuickApplication: true,
            mixerNumber: mixer!,
        };

        console.log("application add request:", request);

        await addApplicationInPreQueueAsync(request);
    };

    const handleSendApplication = async () => {
        setApplicationDialogOpen(true);
    };

    const handleCloseApplicationDialog = () => {
        setApplicationDialogOpen(false);
    };

    const handleSearchRecipesChanged = async (query: string) => {
        setRecipesQuery(query);
    };

    const handleSearchCategoriesChanged = async (query: string) => {
        setCategoriesQuery(query);
    };

    const handleQuickApplicationChanged = async (value: boolean) => {
        dispatch(setQuickApplication(value));
    };

    const handleCategorySelected = async (category: ProductionCategoryDTO) => {
        dispatch(setCategory(category));
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
            <ConfirmApplicationDialog
                isLoading={isApplicationLoading}
                open={applicationDialogOpen}
                onCancel={handleCloseApplicationDialog}
                onConfirm={handleAddApplication}
            />

            <Card title="Панель рецептов">
                <Space className="mb-2 w-full" direction="vertical" size={24}>
                    <Row gutter={[32, 16]}>
                        <Col span={12}>
                            <Select
                                showSearch
                                placeholder="Выберите категорию рецепта"
                                options={categories}
                                defaultValue={category.name}
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
                                    className: "",
                                    onChange: handlePageChanged,
                                    showTotal(total, range) {
                                        return (
                                            <Typography.Text className=" text-left">
                                                Показано {range[1]} из {total}
                                            </Typography.Text>
                                        );
                                    },
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
                        {mixers?.length > 1 && (
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

                        <Col xxl={5} xl={6} md={6} xs={24} lg={24}>
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
                                onClick={handleSendApplication}
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
