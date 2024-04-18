import { NextFunction, Request } from "express";
import { Response } from "express";

export function errorHandler(status: number, message: string) {
    return ( req: Request, res: Response, next: NextFunction) => {
        
        res.render("error", {
            status: status,
            message: message
        })
    };
};