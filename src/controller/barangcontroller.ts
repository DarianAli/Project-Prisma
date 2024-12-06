import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { number } from "joi";
import { BASE_URL } from "../global";
import fs, { stat } from "fs";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const addInv = async (request: Request, response: Response) => {
    try {
        const { nama, kategori, lokasi, quantity } = request.body;
        const { user } = request.body.user;

        const newInv = await prisma.barang.create({
            data: { nama, kategori, lokasi, quantity: Number(quantity) }
        })

        return response.json({
            status: true,
            data: newInv,
            user: user,
            message: `Barang baru berhasil ditambahkan`
        }).status(200)
    }catch (error) {
        return response.json({
            status: false,
            message: `Error nih`
        }).status(400)
    }
}

export const updateInv = async (request: Request, response: Response) => {
    try {
        const { idBarang } = request.params;
        const { nama, kategori, lokasi, quantity } = request.body;

        const findInv = await prisma.barang.findFirst({
            where: { 
                idBarang: Number(idBarang) 
            }
        })

        if (!findInv)
            return response.status(200).json({
                status: false,
                message: `hewan tidak ditemukan`
            })

        const updateInv = await prisma.barang.update({
            data: {
                nama: nama || findInv.nama,
                kategori: kategori || findInv.kategori,
                lokasi: lokasi || findInv.lokasi,
                quantity: quantity ? Number(quantity) : findInv.quantity
            }, where: { idBarang: Number(idBarang) }
        })
        
        return response.json({
            status: true,
            data: updateInv,
            message: `Barang berhasil diupdate`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `terjadi kesalahan ${error}`
        }).status(400)
    }
}

export const getAllInv = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;

        // Log the search parameter to ensure it's being passed correctly
        console.log("Search query:", search);

        // Perform the search query to find items by name
        const allInv = await prisma.barang.findMany({
            where: {
                nama: {
                    contains: search ? search.toString() : "", // Ensure the search is properly handled
                },
            },
        });

        // Return success response
        return response.json({
            status: true,
            data: allInv,
            message: `Barang berhasil ditampilkan`,
        });
    } catch (error) {
        // Return error response with status false
        console.error("Error during fetching inventory:", error); // Log the error for debugging
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan: ${error}`,
        }).status(400);
    }
};


export const getBarangById = async (req: Request, res: Response) => {
  try {
    const { idBarang } = req.params;  // Retrieve the idBarang from the URL parameters

    // Fetch the barang by its id
    const barang = await prisma.barang.findUnique({
      where: { idBarang: Number(idBarang) },  // Ensure idBarang is a number
    });

    if (!barang) {
      return res.status(404).json({
        status: "error",
        message: "Barang not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: barang,
      message: "Barang retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `There was an error: ${error}`,
    });
  }
};

export const deleteInv = async (request: Request, response: Response) => {
    try {
        const { idBarang } = request.params

        const findBarang = await prisma.barang.findFirst({ where: { idBarang: Number(idBarang) } })
        if (!findBarang) return response.status(200).json({
            status: false,
            message: `barang tidak ditemukan`
        })

        const deleteBarang = await prisma.barang.delete({
            where: { idBarang: Number(idBarang) }
        })
        return response.json({
            status: true,
            data: deleteBarang,
            message: `barang berhasil dihapus`
        }).status(200)
    }catch (error) {
        return response.json({
            status: false,
            message: `terjadi sebuah kesalahan`
        }).status(400)
    }
}