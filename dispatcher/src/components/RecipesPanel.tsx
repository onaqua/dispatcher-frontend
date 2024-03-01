import { Button, Card, Checkbox, Col, Input, InputNumber, List, Row, Segmented, Select, Skeleton, Space, Typography, message } from "antd";
import { SegmentedValue } from "antd/es/segmented";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmApplicationDialog } from "../dialogs/ConfirmApplicationDialog";
import { Mixer } from "../entities/Mixer";
import { PagedList } from "../entities/PagedList";
import { Recipe } from "../entities/Recipe";
import { RecipeCategory } from "../entities/RecipeCategory";
import { ApplicationsService } from "../services/ApplicationsService";
import { CategoriesService } from "../services/CategoriesService";
import { MixersService } from "../services/MixersService";
import { RecipesService } from "../services/RecipesService";
import { ApiError } from "../services/core/ApiError";
import { AddApplicationInPreQueueRequest } from "../services/requests/LoginRequest";
import { setCategory, setMixer, setQuickApplication, setRecipe, setVolume } from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";

export const RecipesPanel: React.FC = () => {
    const dispatch = useDispatch();
    const [recipesQuery, setRecipesQuery] = useState("");
    const [categoriesQuery, setCategoriesQuery] = useState("");

    const car = useSelector((state: RootState) => state.dispatcher.car);
    const mixer = useSelector((state: RootState) => state.dispatcher.mixer);
    const volume = useSelector((state: RootState) => state.dispatcher.volume);
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);

    const isQuickApplication = useSelector((state: RootState) => state.dispatcher.isQuickApplication);

    const [applicationDialogOpen, setApplicationDialogOpen] = useState<boolean>(false);

    const recipeId = useSelector((state: RootState) => state.dispatcher.recipeId);

    const category = useSelector((state: RootState) => state.dispatcher.category);

    const client = useSelector((state: RootState) => state.dispatcher.client);

    const isRecipeSelected = (id: number) => recipeId === id;

    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleSelectRecipe = (recipeId: number) => dispatch(setRecipe(recipeId));

    const handlePageChanged = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSendApplication = async () => setApplicationDialogOpen(true);

    const handleCloseApplicationDialog = () => setApplicationDialogOpen(false);

    const handleSearchRecipesChanged = async (query: string) => setRecipesQuery(query);

    const handleSearchCategoriesChanged = async (query: string) => setCategoriesQuery(query);

    const handleQuickApplicationChanged = async (value: boolean) => dispatch(setQuickApplication(value));

    const handleCategorySelected = async (category: RecipeCategory) => dispatch(setCategory(category));

    const handleVolumeChanged = (value: number | null) => value && dispatch(setVolume(value));

    const handleMixerChanged = (value: SegmentedValue) => dispatch(setMixer(value.valueOf() as number));

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

        await addApplicationInPreQueueAsync(request);
    };

    const { data: recipes, isLoading: isRecipesLoading, isSuccess: isRecipesLoadedSuccess } = useQuery<PagedList<Recipe>, ApiError>(
        ["recipes", currentPage, recipesQuery, category, mixer],
        () => RecipesService.SearchAsync(recipesQuery, category.id, mixer, currentPage, 5),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const { data: categories, isLoading: isCategoriesLoading, isSuccess: isCategoriesLoadedSuccess } = useQuery<
        PagedList<RecipeCategory>,
        ApiError
    >(["categories", categoriesQuery], () => CategoriesService.SearchAsync(categoriesQuery, 1, 5), {
        onError(error) {
            message.error(error.body.Details);
        },
    });

    const { data: mixers, isLoading: isMixersLoading, isSuccess: isMixersLoadedSuccess } = useQuery<Array<Mixer>, ApiError>(
        "mixers",
        () => MixersService.GetAsync(),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    const { isLoading: isApplicationLoading, mutateAsync: addApplicationInPreQueueAsync } = useMutation<
        void,
        ApiError,
        AddApplicationInPreQueueRequest
    >((request) => ApplicationsService.AddInPreQueueAsync(request), {
        onError(error) {
            message.error(error.body.Details);
        },
        onSuccess: () => setApplicationDialogOpen(false),
    });

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
                                loading={isCategoriesLoading}
                                placeholder="Выберите категорию рецепта"
                                options={categories?.items}
                                fieldNames={{ label: "name", value: "name" }}
                                defaultValue={category.name}
                                onSearch={handleSearchCategoriesChanged}
                                onFocus={() => handleSearchCategoriesChanged("")}
                                onSelect={(_, v) => handleCategorySelected(v)}
                                className=" w-full"
                            ></Select>
                        </Col>

                        <Col span={12}>
                            <Input.Search
                                value={recipesQuery}
                                onChange={({ target }) => handleSearchRecipesChanged(target.value)}
                                placeholder="Введите название рецепта для поиска"
                            ></Input.Search>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            {isRecipesLoadedSuccess && (
                                <List
                                    loading={isRecipesLoading}
                                    className="mt-4 min-h-80"
                                    dataSource={recipes.items}
                                    rootClassName="min-h-80"
                                    pagination={{
                                        pageSize: 5,
                                        current: currentPage,
                                        total: recipes.totalItemCount,
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
                                    renderItem={(item) => (
                                        <List.Item className="cursor-pointer" onClick={() => handleSelectRecipe(item.id)}>
                                            <List.Item.Meta title={<Checkbox checked={isRecipeSelected(item.id)}>{item.name}</Checkbox>} />
                                        </List.Item>
                                    )}
                                />
                            )}
                            {isRecipesLoading && <Skeleton active paragraph={{ rows: 8 }} loading={true} />}
                        </Col>
                    </Row>

                    <Row gutter={[36, 16]}>
                        {isMixersLoadedSuccess && (
                            <Col xxl={12} xl={12} md={12} xs={24} lg={24}>
                                <Segmented
                                    className="w-full"
                                    defaultChecked={true}
                                    defaultValue={mixers[0].virtualNumber}
                                    title="Выберите миксер"
                                    value={mixer}
                                    placeholder="Выберите миксер"
                                    options={mixers.map((e) => ({
                                        label: `${e.virtualNumber}-й смеситель`,
                                        value: e.virtualNumber,
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
                            <Checkbox value={isQuickApplication} onChange={(e) => handleQuickApplicationChanged(e.target.checked)}>
                                Быстрая заявка
                            </Checkbox>
                        </Col>

                        <Col xxl={12} xl={12} md={12} xs={24} lg={24} className=" right-0 flex justify-end">
                            <Button type="primary" loading={isApplicationLoading} onClick={handleSendApplication} className="right-0">
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
