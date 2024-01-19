import { Button, Card, Divider, Form, Input, Typography } from "antd";

export type LoginFields = {
    username: string;
    password: string;
};

export const LoginPage: React.FC = () => {
    async function handleFinish(values: LoginFields) {
        console.log(values);
    }

    function handleFinishFailed() {}

    return (
        <Card title="Диспетчер">
            <Typography.Text className="text-slate-400">
                Заполните ваш логин и пароль
            </Typography.Text>

            <Form
                className="mt-5"
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 600 }}
                onFinish={handleFinish}
                onFinishFailed={handleFinishFailed}
            >
                <Form.Item<LoginFields>
                    name="username"
                    label="Логин"
                    rules={[{ required: true, message: "Заполните логин!" }]}
                    children={<Input />}
                />

                <Form.Item<LoginFields>
                    name="password"
                    label="Пароль"
                    rules={[{ required: true, message: "Заполните пароль!" }]}
                    children={<Input.Password />}
                />
                <Divider />
                <Form.Item>
                    <Button className="w-full" type="primary" htmlType="submit">
                        Войти
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button className="w-full" type="dashed" htmlType="button">
                        Восстановить аккаунт
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
