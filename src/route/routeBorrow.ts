import express  from "express";
import { borrowItem, returnItem, laporanPenggunaan, analisisBarang } from "../controller/last";
import { validateBorrowData, validateReturnData } from "../midleware/validationBorrow";
import { analisisPenggunaanMiddlewares } from "../midleware/analisis"
import { verifyToken } from "../midleware/authorization";

const app = express()
app.use(express.json())

// Route untuk meminjam barang
app.post("/inventory/borrow", [validateBorrowData, verifyToken ], borrowItem);

// Route untuk mengembalikan barang
app.post("/inventory/return", [validateReturnData, verifyToken], returnItem);

app.post("/inventory/usage-report", [laporanPenggunaan, verifyToken], laporanPenggunaan)

app.post("/inventory/borrow-analysis", [analisisPenggunaanMiddlewares, verifyToken], analisisBarang)

// app.post("/inventory/usage-report", validateAnalysisData, createAnalysis)


export default app;
