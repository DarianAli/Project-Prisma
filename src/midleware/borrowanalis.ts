// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient({ errorFormat: "pretty" })


// export const getBorrowAnalysis = async (startDate: string, endDate: string) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   // Query frequently borrowed items
//   const frequentlyBorrowed = await prisma.borrow.findMany({
//     where: {
//       tanggalPinjam: {
//         gte: start,
//         lte: end,
//       },
//     },
//     groupBy: {
//       barang_id: true,
//       _count: {
//         _all: true,
//       },
//     },
//     select: {
//       barang_id: true,
//       _count: true,
//     },
//   });

//   // Query inefficient items (borrowed frequently but returned late)
//   const inefficientItems = await prisma.borrow.findMany({
//     where: {
//       tanggalPinjam: {
//         gte: start,
//         lte: end,
//       },
//       tanggalKembali: {
//         gt: new Date(), // If the return date is in the future, it means it's late
//       },
//     },
//     groupBy: {
//       barang_id: true,
//       _count: {
//         _all: true,
//       },
//     },
//     select: {
//       barang_id: true,
//       _count: true,
//     },
//   });

//   return {
//     frequentlyBorrowed,
//     inefficientItems,
//   };
// };
