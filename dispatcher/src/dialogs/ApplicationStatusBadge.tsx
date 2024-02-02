import { Badge } from "antd";
import { ApplicationStatus } from "../entities/ApplicationDTO";


export const ApplicationStatusBadge: React.FC<{
    status: ApplicationStatus;
}> = ({ status }) =>
{
    switch (status)
    {
        case ApplicationStatus.Complete:
            return <Badge status="success" text="Выполнена" />;
        case ApplicationStatus.DosingIsCompleted:
            return <Badge status="processing" text="Дозирование окончено" />;
        case ApplicationStatus.Mixing:
            return <Badge status="processing" text="Перемешивание" />;
        case ApplicationStatus.Run:
            return <Badge status="processing" text="Выгрузка из смесителя" />;
        case ApplicationStatus.UnloadingIntoMixer:
            return <Badge status="processing" text="Выгрузка в смеситель" />;
        case ApplicationStatus.Dosing:
            return <Badge status="processing" text="Дозирование" />;
        case ApplicationStatus.Wait:
            return <Badge status="warning" text="В очереди" />;
        case ApplicationStatus.WaitForDosing:
            return (
                <Badge
                    status="warning"
                    text="Ожидает подготовки к дозированию" />
            );
        default:
            return <span className="text-red-500">Ошибка</span>;
    }
};
