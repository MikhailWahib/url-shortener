import { body } from "express-validator"

export const urlValidation = [
    body("url", "URL cannot be empty").notEmpty(),
    body("url", "Please enter a valid URL").isURL(),
]


