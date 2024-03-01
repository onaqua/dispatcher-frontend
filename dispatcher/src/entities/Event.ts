
export interface Event
{
    id: number;
    lineNumber: number;
    date: string;
    valueBefore: string;
    valueAfter: string;
    status: number;
    objectId: number;
    name: string;
    typeId: number;
    description: string;
    level: number;
    details: string;
    userId: number;
    userName: string;
}
