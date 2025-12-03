import type { UserResponse } from "../interface/UserResponse";

const getObjectById = (data: UserResponse[], email: string | number) : UserResponse | undefined => {
    return data.find((item) => item.email === email);
};

const getObjectByEmail = (data: UserResponse[], id: string | number) : UserResponse | undefined => {
    return data.find((item) => item.id == id);
};

export { getObjectById, getObjectByEmail };