import { Request, Response, NextFunction } from 'express';

const validate = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

        if (result.error) {
            const errors = result.error.details.map((err: any) => err.message);
            return res.status(400).json({ errors });
        }
        next();
    };
};

export default validate;