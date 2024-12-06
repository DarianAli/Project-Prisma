import { NextFunction, Request, Response } from "express";
import Joi, { isSchema } from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// Skema untuk menambah barang
export const addInvSchema = Joi.object({
    nama: Joi.string().required(),          // Nama barang harus diisi dan berupa string
    kategori: Joi.string().valid('ELEKTRONIK', 'NON_ELEKTRONIK').required(),      // Kategori barang harus diisi dan berupa string
    lokasi: Joi.string().required(),        // Lokasi barang harus diisi dan berupa string
    quantity: Joi.number().integer().min(1).required(), // Quantity harus berupa angka integer dan minimal 1
});

// Skema untuk memperbarui barang
export const updateInvSchema = Joi.object({
    nama: Joi.string().optional(),          // Nama barang opsional untuk update
    kategori: Joi.string().valid('ELEKTRONIK', 'NON_ELEKTRONIK').optional(),      // Kategori barang opsional untuk update
    lokasi: Joi.string().optional(),        // Lokasi barang opsional untuk update
    quantity: Joi.number().integer().min(1).optional(),  // Quantity opsional, jika ada harus berupa angka integer minimal 1
});

export const verifyAddInv = async (request: Request, response: Response, next: NextFunction) => {
    // validasi data dari request body yang dikirimkan dan mengambil error jika terdapat error
    const { error } = addInvSchema.validate(request.body, {abortEarly: false})

    if (error) {
        // jika terdapat error akan memberikan pesan seperti ini
        return response.json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }

    const { nama } = request.body;

    // Periksa apakah username sudah ada di database
    const existingUser = await prisma.barang.findFirst({
        where: { nama },
    });

    if (existingUser) {
        return response.status(400).json({
            status: false,
            message: "Nama barang sudah dibuat",
        });
    }

    return next()
}

export const verifyEditInv = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Validasi data dari request body
        const { error } = updateInvSchema.validate(request.body, { abortEarly: false });

        if (error) {
            return response.status(400).json({
                status: false,
                message: error.details.map((it) => it.message).join(),
            });
        }

        const { nama } = request.body;
        const { idBarang } = request.params; // Pastikan ID barang dikirim dalam params

        // Validasi apakah nama barang sudah ada di database, tetapi abaikan ID barang yang sedang diedit
        const existingItem = await prisma.barang.findFirst({
            where: {
                nama,
                NOT: { idBarang: Number(idBarang) }, // Mengecualikan barang dengan ID yang sedang diedit
            },
        });

        if (existingItem) {
            return response.status(400).json({
                status: false,
                message: "Nama barang sudah digunakan, pilih nama lain.",
            });
        }

        // Jika semua validasi berhasil, lanjutkan ke middleware berikutnya
        next();
    } catch (error) {
        console.error("Error in verifyEditInv:", error);
        return response.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat memvalidasi data.",
            error: error,
        });
    }
};
  




