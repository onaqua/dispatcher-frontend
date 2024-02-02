import { Input, Modal, Space, Table, message } from "antd";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { ApiError } from "../services/core/ApiError";
import { CarsService } from "../services/CarsService";
import { PaginationProps } from "../types/PaginationProps";
import { PagedList } from "../entities/PagedList";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";

export type CreateCarDialogProps = {
    isOpen: boolean;
    onClose?(): void;
    onOk?(): void;
};

export const CreateCarDialog: React.FC<CreateCarDialogProps> = ({
    isOpen,
    onClose,
    onOk,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [cars, setCars] = useState<PagedList<ProductionCarDTO>>({
        items: [],
        totalItems: 0,
    });

    const {
        isLoading: isCarsLoading,
        mutateAsync: searchCarsAsync,
    } = useMutation<PagedList<ProductionCarDTO>, ApiError, PaginationProps>(
        (pagination) =>
            CarsService.SearchAsync(
                pagination.query,
                pagination.page,
                pagination.pageSize
            ),
        {
            onError(error) {
                message.error(error.body.Details);
            },
        }
    );

    return (
        <Modal
            cancelButtonProps={{ disabled: true }}
            open={isOpen}
            onCancel={onClose}
            onOk={onOk}
            cancelText="Отмена"
            okText="Сохранить"
        >
            <Space direction="vertical" className=" w-full">
                <Input placeholder="Начните ввод для поиска"></Input>
                <Table loading={isCarsLoading} />
            </Space>
        </Modal>
    );
};
