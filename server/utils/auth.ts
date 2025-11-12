import { Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../repositories/user.repository"

export const signToken = (user: Omit<User, "password">, res: Response) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    })

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
}


