import
    {
        Button,
        Card,
        Divider,
        Form,
        Input,
        Space,
        Spin,
        Typography,
        message,
    } from "antd";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AuthorizationService } from "../services/AuthorizationService";
import { ApiError } from "../services/core/ApiError";
import { LoginRequest } from "../services/requests/LoginRequest";

export type LoginFields = {
    email: string;
    password: string;
};

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const { isLoading, isError, mutateAsync: signInAsync } = useMutation<
        void,
        ApiError,
        LoginRequest
    >((request) => AuthorizationService.SignInAsync(request), {
        onSuccess: () => navigate("/"),
        onError(error) {
            message.error(error.body.Details);
        },
    });

    const handleSubmit = async (values: LoginFields) => {
        const request: LoginRequest = {
            email: values.email,
            password: values.password,
        };

        await signInAsync(request);
    };

    return (
        <div className=" flex justify-center items-center h-full">
            <Spin spinning={isLoading}>
                <Card title="Диспетчер">
                    <Space
                        direction="vertical"
                        align="center"
                        className=" w-full"
                    >
                        <Typography.Text className="text-slate-400">
                            Заполните ваш почтовый адрес и пароль
                        </Typography.Text>

                        {isError && (
                            <Typography.Text type="danger">
                                Неправильный логин или пароль
                            </Typography.Text>
                        )}
                    </Space>

                    <Form
                        className="mt-5"
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{ maxWidth: 600 }}
                        onFinish={handleSubmit}
                    >
                        <Form.Item<LoginFields>
                            name="email"
                            label="Почтовый адрес"
                            rules={[
                                {
                                    required: true,
                                    message: "Заполните почтовый адрес!",
                                },
                            ]}
                            children={<Input />}
                        />

                        <Form.Item<LoginFields>
                            name="password"
                            label="Пароль"
                            rules={[
                                {
                                    required: true,
                                    message: "Заполните пароль!",
                                },
                            ]}
                            children={<Input.Password />}
                        />
                        <Divider />
                        <Form.Item>
                            <Button
                                className="w-full"
                                type="primary"
                                htmlType="submit"
                            >
                                Войти
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                className="w-full"
                                type="dashed"
                                htmlType="button"
                            >
                                Восстановить аккаунт
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        </div>
    );
};
