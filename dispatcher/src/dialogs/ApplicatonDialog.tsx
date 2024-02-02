import { Divider, Progress, Space, Typography, message } from "antd";
import Modal from "antd/es/modal/Modal";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ProductionApplicationDTO } from "../entities/ApplicationDTO";
import { ApplicationsService } from "../services/ApplicationsService";
import { ApiError } from "../services/core/ApiError";
import { setApplication } from "../store/reducers/dispatcherSlice";
import { RootState } from "../store/store";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

export type ApplicationDialogProps = {
    isOpen: boolean;
    isOperatorQueue: boolean;

    applicationId?: number | undefined;
    onClose?(): void;
    onOk?(): void;
};

export const ApplicationDialog: React.FC<ApplicationDialogProps> = ({
    isOpen = false,
    isOperatorQueue = false,
    applicationId,
    onClose,
    onOk,
}) => {
    const dispatch = useDispatch();

    const application = useSelector(
        (state: RootState) => state.dispatcher.application
    );

    const {
        isLoading: isApplicationLoading,
        mutateAsync: getApplicationAsync,
    } = useMutation<ProductionApplicationDTO, ApiError, number>(
        (applicationId) => ApplicationsService.GetInQueueAsync(applicationId),
        {
            onSuccess(data) {
                dispatch(setApplication(data));
            },
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    useEffect(() => {
        if (applicationId) {
            getApplicationAsync(applicationId);
        }
    }, [applicationId]);

    return (
        <>
            {application && applicationId && (
                <Modal
                    cancelText="Закрыть"
                    okText="Ок"
                    onCancel={onClose}
                    onOk={onOk}
                    open={isOpen}
                    title={
                        <>
                            <Typography.Text>
                                Заявка {application.id} -{" "}
                                <ApplicationStatusBadge
                                    status={application.status}
                                />
                            </Typography.Text>
                        </>
                    }
                >
                    <Space direction="vertical" className=" w-full">
                        <Typography.Text>
                            Прогресс выполнения заявки
                        </Typography.Text>

                        <Typography.Text type="secondary">
                            Выполненный объём: {application.currentVolume} из{" "}
                            {application.volume}
                        </Typography.Text>

                        <Progress
                            type="line"
                            trailColor="geekblue"
                            strokeColor="geekblue"
                            percent={
                                (application.currentVolume /
                                    application.volume) *
                                100
                            }
                        ></Progress>

                        <Divider />

                        <Typography.Text>Клиент</Typography.Text>

                        <Typography.Text type="secondary">
                            Имя клиента:{" "}
                            <Typography.Link>
                                {application.client.name}
                            </Typography.Link>
                        </Typography.Text>

                        <Typography.Text type="secondary">
                            Адрес клиента:{" "}
                            {application.client.address &&
                            application.client.address.length > 0 &&
                            application.client.address != " " ? (
                                <Typography.Link>
                                    {application.client.address}
                                </Typography.Link>
                            ) : (
                                "Неизвестный адрес"
                            )}
                        </Typography.Text>

                        <Divider />

                        <Typography.Text>Автомобиль</Typography.Text>

                        <Typography.Text type="secondary">
                            Объём автомобиля: {application.car.volume}
                        </Typography.Text>

                        <Typography.Text type="secondary">
                            Регистрационный номер:{" "}
                            <Typography.Link>
                                {application.car.plateNumber}
                            </Typography.Link>
                        </Typography.Text>
                    </Space>
                </Modal>
            )}
        </>
    );
};

export default ApplicationDialog;
