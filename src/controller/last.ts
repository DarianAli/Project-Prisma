import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { stat } from "fs";

const prisma = new PrismaClient();



export const borrowItem = async (request: Request, response: Response) => {
  try {
    const { item_id, quantity } = request.body;
    const user = request.body.user;

    console.log(user)

    const idUser = user.id; // Pastikan mengambil `idUser` sesuai skema
    const jumlahPinjam = quantity;

    // Ambil data barang berdasarkan ID
    const barang = await prisma.barang.findUnique({
      where: { idBarang: item_id },
    });

    if (!barang) {
      return response
        .status(400)
        .json({ error: "Barang tidak ditemukan." });
    }

    if (barang.quantity === 0) {
      return response
        .status(400)
        .json({ message: "Stok barang tidak tersedia." });
    }

    if (jumlahPinjam > barang.quantity) {
      return response.status(400).json({
        message: `Jumlah yang diminta (${jumlahPinjam}) melebihi stok (${barang.quantity}).`,
      });
    }

    const borrowDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(borrowDate.getDate() + 7); // Pinjam selama 7 hari

    // Buat record peminjaman
    const peminjaman = await prisma.borrow.create({
      data: {
        user: idUser,
        barang: item_id,
        jumlah: jumlahPinjam,
        tanggalPinjam: borrowDate,
        tanggalKembali: returnDate,
        statusPinjam: "MENUNGGU", // Menggunakan enum
      },
    });

    // Update stok barang
    await prisma.barang.update({
      where: { idBarang: item_id },
      data: {
        quantity: barang.quantity - jumlahPinjam,
      },
    });

    return response.status(200).json({
      status: "success",
      data: peminjaman,
      message: `Barang berhasil dipinjam. Silakan kembalikan sebelum ${returnDate.toLocaleDateString()}.`,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      status: "failed",
      message: `Terjadi kesalahan: ${error}`,
    });
  }
};

export const returnItem = async (request: Request, response: Response) => {
  try {
    const { borrow_id, return_date, quantity } = request.body;

    // Validasi input
    if (!borrow_id || !return_date || quantity === undefined) {
      return response.status(400).json({
        status: "failed",
        message: "borrow_id, return_date, dan quantity harus diisi",
      });
    }

    // Temukan record peminjaman berdasarkan borrow_id
    const borrowRecord = await prisma.borrow.findUnique({
      where: { idBorrow: Number(borrow_id) },
    });

    if (!borrowRecord) {
      return response.status(404).json({
        status: "failed",
        message: "Peminjaman tidak ditemukan",
      });
    }

    // Validasi barang yang dipinjam
    if (!borrowRecord.barang) {
      return response.status(400).json({
        status: "failed",
        message: "Barang yang dipinjam tidak valid",
      });
    }

    // Ambil data barang berdasarkan id
    const item = await prisma.barang.findUnique({
      where: { idBarang: borrowRecord.barang },
    });

    if (!item) {
      return response.status(404).json({
        status: "failed",
        message: "Barang tidak ditemukan",
      });
    }

    // Normalisasi dan hitung tanggal pengembalian
    const returnDate = new Date(return_date);
    returnDate.setHours(0, 0, 0, 0);

    const borrowDate = new Date(borrowRecord.tanggalPinjam);
    borrowDate.setHours(0, 0, 0, 0);

    const maxReturnDate = new Date(borrowDate);
    maxReturnDate.setDate(maxReturnDate.getDate() + 7); // Batas waktu pengembalian 7 hari
    maxReturnDate.setHours(0, 0, 0, 0);

    // Validasi tanggal pengembalian
    if (returnDate < borrowDate) {
      return response.status(400).json({
        status: "failed",
        message: "Tanggal pengembalian tidak boleh lebih awal dari tanggal peminjaman.",
      });
    }

    // Hitung apakah terlambat
    const isLate = returnDate > maxReturnDate;
    const statusKembali = isLate ? "TELAT" : "DIKEMBALIKAN";

    // Validasi jumlah pengembalian
    if (quantity > borrowRecord.jumlah - (borrowRecord.actualReturnQuantity || 0)) {
      return response.status(400).json({
        status: "failed",
        message: `Jumlah pengembalian tidak boleh lebih banyak dari jumlah yang dipinjam (${borrowRecord.jumlah}).`,
      });
    }

    // Update data pengembalian pada record peminjaman
    const updatedBorrow = await prisma.borrow.update({
      where: { idBorrow: Number(borrow_id) },
      data: {
        tanggalKembali: returnDate,
        actualReturnQuantity: (borrowRecord.actualReturnQuantity || 0) + quantity,
        statusPinjam: statusKembali,
      },
    });

    // Update stok barang (menambah kembali jumlah barang yang dikembalikan)
    await prisma.barang.update({
      where: { idBarang: borrowRecord.barang },
      data: {
        quantity: item.quantity + quantity,
      },
    });

    // Kirim respon
    return response.status(200).json({
      status: "success",
      message: "Pengembalian barang berhasil dicatat.",
      data: {
        borrow_id: updatedBorrow.idBorrow,
        user_id: updatedBorrow.user,
        item_id: updatedBorrow.barang,
        quantity: updatedBorrow.jumlah,
        statusPinjam: updatedBorrow.statusPinjam,
        borrow_date: updatedBorrow.tanggalPinjam.toISOString().split("T")[0], // Format YYYY-MM-DD
        actual_return_quantity: updatedBorrow.actualReturnQuantity,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      status: "error",
      message: `Terjadi kesalahan: ${error}`,
    });
  }
};


export const laporanPenggunaan = async (request: Request, response: Response) => {
  interface UsageAnalysis {
    group: string; // kategori atau lokasi
    total_borrowed: number;
    total_returned: number;
    items_in_use: number;
  }

  try {
    const { start_date, end_date, group_by } = request.body;

    // Validasi input
    if (!start_date || !end_date) {
      return response.status(400).json({
        status: "failed",
        message: "start_date dan end_date harus diisi",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate > endDate) {
      return response.status(400).json({
        status: "failed",
        message: "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.",
      });
    }

    // Validasi group_by (hanya bisa 'category' atau 'location')
    const allowedGroupBy = ['category', 'location'];
    if (!allowedGroupBy.includes(group_by)) {
      return response.status(400).json({
        status: "failed",
        message: "group_by hanya boleh berisi 'category' atau 'location'.",
      });
    }

    // Ambil data barang dan peminjaman dalam rentang tanggal
    const items = await prisma.barang.findMany({
      include: {
        borrow: {
          where: {
            tanggalPinjam: { gte: startDate, lte: endDate },
          },
          select: {
            jumlah: true,
            statusPinjam: true,
          },
        },
      },
    });

    if (items.length === 0) {
      return response.status(200).json({
        status: "success",
        message: "Tidak ada data yang ditemukan untuk periode ini.",
        data: [],
      });
    }

    // Analisis penggunaan berdasarkan kategori atau lokasi
    const usageAnalysisMap: { [key: string]: UsageAnalysis } = {};

    items.forEach((barang) => {
      const groupKey = group_by === "category" ? barang.kategori : barang.lokasi;

      if (!usageAnalysisMap[groupKey]) {
        usageAnalysisMap[groupKey] = {
          group: groupKey,
          total_borrowed: 0,
          total_returned: 0,
          items_in_use: 0,
        };
      }

      barang.borrow.forEach((borrowData) => {
        const totalBorrowed = borrowData.jumlah;
        const totalReturned = borrowData.statusPinjam === "DIKEMBALIKAN" ? borrowData.jumlah : 0;
        const itemsInUse = totalBorrowed - totalReturned;

        usageAnalysisMap[groupKey].total_borrowed += totalBorrowed;
        usageAnalysisMap[groupKey].total_returned += totalReturned;
        usageAnalysisMap[groupKey].items_in_use += itemsInUse;
      });
    });

    // Konversi hasil analisis menjadi array
    const usageAnalysis: UsageAnalysis[] = Object.values(usageAnalysisMap);

    // Berikan respon
    return response.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date: start_date,
          end_date: end_date,
        },
        usage_analysis: usageAnalysis,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      status: "failed",
      message: `Terjadi kesalahan: ${error}`,
    });
  }
};


export const analisisBarang = async (request: Request, response: Response) => {
  try {
      const { start_date, end_date } = request.body;

      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      // Frequently borrowed items query
      const frequentlyBorrowedItems = await prisma.borrow.groupBy({
          by: ['barang'], // Grouping by barang (foreign key)
          where: {
              tanggalPinjam: {
                  gte: startDate,  // Correct date field
              },
              tanggalKembali: {
                  lte: endDate,  // Correct date field
              },
          },
          _count: {
              barang: true,  // Counting occurrences of barang
          },
          orderBy: {
              _count: {
                  barang: 'desc', // Order by most borrowed
              },
          },
      });

      // Getting details for frequently borrowed items
      const frequentlyBorrowedItemDetails = await Promise.all(frequentlyBorrowedItems.map(async item => {
          if (item.barang === null) {
              return null;
          }

          const barang = await prisma.barang.findUnique({
              where: { idBarang: item.barang },  // Use the correct field
              select: { idBarang: true, nama: true, kategori: true },
          });

          return barang ? {
              idBarang: item.barang,
              name: barang.nama,  // Correct field name
              category: barang.kategori,  // Correct field name
              total_borrowed: item._count.barang,  // Count of borrowed items
          } : null;
      })).then(results => results.filter(item => item !== null));  // Filter out null items

      // Inefficient items query (late returns)
      const inefficientItems = await prisma.borrow.groupBy({
          by: ['barang'],  // Grouping by barang (foreign key)
          where: {
              tanggalPinjam: {
                  gte: startDate,
              },
              actualReturnDate: {
                  gt: endDate,  // Check if the actual return date is later than endDate
              },
          },
          _count: {
              barang: true,  // Counting occurrences of barang
          },
          _sum: {
              jumlah: true,  // Sum of borrowed quantities
          },
          orderBy: {
              _count: {
                  barang: 'desc',  // Order by most borrowed items with late returns
              },
          },
      });

      // Getting details for inefficient items (late returns)
      const inefficientItemDetails = await Promise.all(inefficientItems.map(async item => {
          if (item.barang === null) {
              return null;
          }

          const barang = await prisma.barang.findUnique({
              where: { idBarang: item.barang },  // Use the correct field
              select: { idBarang: true, nama: true, kategori: true },
          });

          return barang ? {
              idBarang: item.barang,
              name: barang.nama,  // Correct field name
              category: barang.kategori,  // Correct field name
              total_borrowed: item._count.barang,  // Count of borrowed items
              total_late_returns: item._sum?.jumlah ?? 0,  // Sum of late returns
          } : null;
      })).then(results => results.filter(item => item !== null));  // Filter out null items

      // Return response with data
      response.status(200).json({
          status: "success",
          data: {
              analysis_period: {
                  start_date: start_date,
                  end_date: end_date,
              },
              frequently_borrowed_items: frequentlyBorrowedItemDetails,
              inefficient_items: inefficientItemDetails,
          },
          message: "Analisis barang berhasil dihasilkan.",
      });
  } catch (error) {
      return response.json({
          status: "failed",
          message: `Terdapat sebuah kesalahan: ${error}`,
      }).status(400);
  }
};


//     const inefficientItemDetails = inefficientItems.map((item) => {
//       const actualReturnDate = item.actualReturnDate ? new Date(item.actualReturnDate) : null;
//       const tanggalKembali = item.tanggalKembali ? new Date(item.tanggalKembali) : null;

//       // Hitung keterlambatan dalam hari (jika tanggal valid)
//       const keterlambatan = actualReturnDate && tanggalKembali
//         ? Math.ceil((actualReturnDate.getTime() - tanggalKembali.getTime()) / (1000 * 60 * 60 * 24))
//         : null;

//       return {
//         idBarang: item.barang_id?.idBarang,
//         nama: item.barang_id?.nama,
//         kategori: item.barang_id?.kategori,
//         totalDipinjam: item.jumlah,
//         keterlambatan, // Tetapkan `null` jika salah satu tanggal tidak valid
//       };
//     });

//     response.status(200).json({
//       status: 'success',
//       data: {
//         periodeAnalisis: {
//           start_date: start_date,
//           end_date: end_date,
//         },
//         barangSeringDipinjam: frequentlyBorrowedItemDetails,
//         barangTelatPengembalian: inefficientItemDetails,
//       },
//       message: 'Analisis barang berhasil dihasilkan.',
//     });
//   } catch (error) {
//     response.status(400).json({
//       status: 'failed',
//       message: `Terdapat sebuah kesalahan: ${error}`,
//     });
//   }
// };
