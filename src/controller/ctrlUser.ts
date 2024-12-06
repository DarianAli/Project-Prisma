import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { number } from "joi";
import { BASE_URL, SECRET } from "../global";
import fs, { stat } from "fs";
import md5 from "md5"
import { sign } from "jsonwebtoken";


const prisma = new PrismaClient({ errorFormat: "pretty" })

export const addUser = async (request: Request, response: Response) => {
    try {
        const { username, role, password } = request.body
        
        const newUser = await prisma.user.create({
            data: { username, role, password: md5(password) }
        })

        return response.json({
            status: true,
            data: newUser,
            message: `Pembuatan user berhasil`
        }).status(200)
    }catch (error) {
        response.json({
            status: false,
            message: `maaf ada sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const {username, password} = request.body

        const user = await prisma.user.findFirst({
            where: { username, password: md5(password) }
        })
        
        if (!user) return response.status(200).json({
            status: false,
            logged: false,
            message: `username atau password invalid`
        })

        let data = {
            id: user.idUser,
            username: user.username,
            role: user.role
        }
        let token = sign (data, SECRET || "token")

        return response.status(200).json({
            status: true,
            logged: true,
            message: `Login berhasil!`,
            token
        })
    }catch (error) {
        return response.json({
            status: false,
            message: `terjadi sebuah kesalahan ${error}`
        })
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      const users = await prisma.user.findMany({
        where: { username: { contains: search?.toString() || "" } },
      });
  
      return res
        .json({
          status: "success",
          data: users,
          message: "Successfully get all users",
        })
        .status(200);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: `There is an error ${error}`,
        error: error,
      });
    }
  };

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { idUser } = request.params
        const { username, role, password } = request.body

        const findUser = await prisma.user.findFirst({ where: {  idUser: {equals: Number(idUser) } } })
        if (!findUser) return response.status(200).json({
            status: false,
            message: `user tidak ditemukan`
        })

        const updateUser = await prisma.user.update({
            data: {
                username: username || findUser.username,
                role: role || findUser.role,
                password: password ? md5(password) : findUser.password
            }, where: {idUser: Number(idUser) }
        })
        
        return response.json({
            status: true,
            data: updateUser,
            message: `user berhasil di update`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahn ${error}`
        }).status(400)
    }
}

export const deleteUser = async (request: Request, response: Response) => {
    try {
        const {idUser} = request.params

        const findUser = await prisma.user.findFirst({ where: {idUser: Number(idUser)} })
        if (!findUser) return response.status(200).json({
            status: false,
            message: `User tidak ditemukan`
        })
        const deleteUser = await prisma.user.delete({
            where: { idUser: Number(idUser) }
        })

        return response.json({
            status: true,
            data: deleteUser,
            message: `user berhasil didelete`
        }).status(200)
    }catch (error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan`
        }).status(400)
    }
}
