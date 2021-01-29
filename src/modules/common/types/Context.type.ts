import { Request } from "express";

export interface ContextType {
    req: Request,
    user: UserDecoded
}

export interface UserDecoded {
    email: string,
    id: number,
    iat: number,
    exp: number
}