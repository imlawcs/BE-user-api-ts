interface IUserToCreate {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: number;
}

interface IUserToGet {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
}

interface IUserToUpdate {
    id?: string; 
    username?: string;
    email?: string;
    password?: string; 
    fullName?: string; 
    roleId?: number; 
}

export {
    IUserToCreate,
    IUserToGet,
    IUserToUpdate
};

