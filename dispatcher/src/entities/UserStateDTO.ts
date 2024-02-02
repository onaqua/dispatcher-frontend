export type UserStateDTO = {
    email: string;
    firstName: string;
    lastName: string;
    roles: Array<string>;
    phone?: string | null;
};

export default UserStateDTO;