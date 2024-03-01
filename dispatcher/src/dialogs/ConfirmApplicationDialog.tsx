import
    {
        Descriptions,
        Flex,
        Modal,
        Space,
        Tag,
        Tooltip,
        Typography,
    } from "antd";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Recipe } from "../entities/Recipe";
import { RecipesService } from "../services/RecipesService";
import { ApiError } from "../services/core/ApiError";
import { RootState } from "../store/store";

export type ConfirmApplicationDialogProps = {
    open: boolean;
    isLoading: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
};

export const ConfirmApplicationDialog: React.FC<ConfirmApplicationDialogProps> = ({
    open,
    isLoading,
    onConfirm,
    onCancel,
}) => {
    const car = useSelector((state: RootState) => state.dispatcher.car);
    const mixer = useSelector((state: RootState) => state.dispatcher.mixer);
    const volume = useSelector((state: RootState) => state.dispatcher.volume);
    const invoice = useSelector((state: RootState) => state.dispatcher.invoice);
    const recipeId = useSelector(
        (state: RootState) => state.dispatcher.recipeId
    );
    const isQuickApplication = useSelector(
        (state: RootState) => state.dispatcher.isQuickApplication
    );

    const client = useSelector((state: RootState) => state.dispatcher.client);

    const { data: recipeDetails } = useQuery<Recipe | undefined, ApiError>({
        queryKey: ["recipe", recipeId],
        queryFn: () =>
            isRecipeSelected
                ? RecipesService.GetAsync(recipeId!)
                : Promise.resolve(undefined),
    });

    const isRecipeSelected = recipeId !== 0;

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            destroyOnClose={true}
            okText="Отправить"
            okButtonProps={{ disabled: !isRecipeSelected, loading: isLoading }}
            cancelText="Отменить"
            title="Подтверждение заявки"
            closable={false}
            onOk={onConfirm}
        >
            <Space direction="vertical">
                <Descriptions title="Накладная" extra={invoice}></Descriptions>

                <Descriptions
                    title="Быстрая заявка"
                    extra={isQuickApplication ? "Да" : "Нет"}
                ></Descriptions>

                <Descriptions
                    title="Объём заявки"
                    extra={volume}
                ></Descriptions>

                <Descriptions title="Смеситель" extra={mixer}></Descriptions>

                <Descriptions
                    title="Клиент"
                    extra={client?.name}
                ></Descriptions>

                <Descriptions title="Машина" extra={car.name}></Descriptions>

                <Descriptions
                    title="Рецепт"
                    extra={recipeDetails?.name}
                ></Descriptions>

                <Typography.Text>
                    <Flex wrap="wrap" gap="middle">
                        {recipeDetails &&
                            recipeDetails.structures.map((structure) => (
                                <Tooltip title="Компонент из рецепта">
                                    <Tag bordered>
                                        {`${structure.component.name}: ${structure.amount}`}
                                    </Tag>
                                </Tooltip>
                            ))}
                    </Flex>
                </Typography.Text>
            </Space>
        </Modal>
    );
};
