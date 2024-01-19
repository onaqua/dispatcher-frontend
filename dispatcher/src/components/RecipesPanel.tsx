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
    Table,
    Tooltip,
    Typography,
} from "antd";

export const RecipesPanel: React.FC = () => {
    return (
        <Card className="w-full h-full">
            <div className="space-y-3 w-full">
                <Select
                    showSearch
                    size="small"
                    className="w-full"
                    placeholder="Введите название рецепта"
                />

                <Select
                    showSearch
                    size="small"
                    className="w-full"
                    placeholder="Выберите категорию рецепта"
                />

                <Checkbox className="w-full">
                    Учитывать материал в бункерах
                </Checkbox>

                <Table>
                    <Table.Column title="№" dataIndex="id"></Table.Column>
                    <Table.Column
                        title="Название"
                        dataIndex="name"
                    ></Table.Column>
                </Table>

                <div className="min-h-14">
                    <Row>
                        <Col xs={24} xl={12}>
                            <div className=" w-full flex space-x-2 items-center">
                                <Typography.Text>Смеситель: </Typography.Text>
                                <Segmented options={["1", "2", "3"]} />
                            </div>
                        </Col>

                        <Col xs={24} xl={12}>
                            <div className=" w-full flex space-x-2 items-center">
                                <Typography.Text className="w-full">
                                    Объём:{" "}
                                </Typography.Text>
                                <InputNumber
                                    min={0}
                                    defaultValue={1}
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
                        <Button type="primary">Создать заявку</Button>
                    </Tooltip>
                </div>
            </div>
        </Card>
    );
};

export default RecipesPanel;
