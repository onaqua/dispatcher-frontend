import { Form, Input, InputNumber } from "antd";
import React from "react";
import { EditableCellProps } from "./EditableCellProps";

export const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    autoFocus,
    ...restProps
}) => {
    const inputNode =
        inputType === "number" ? (
            <InputNumber autoFocus={autoFocus} />
        ) : (
            <Input autoFocus={autoFocus}/>
        );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Введите ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
