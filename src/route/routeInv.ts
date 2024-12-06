import express  from "express";
import { addInv, updateInv, getAllInv, deleteInv, getBarangById} from "../controller/barangcontroller"
import { verifyAddInv, verifyEditInv } from "../midleware/verifyInv"
import { verifyRole, verifyToken } from "../midleware/authorization"


const app = express()
app.use(express.json())

app.post(`/inventory`, [verifyAddInv, verifyToken, verifyRole(["ADMIN"])], addInv),
app.delete(`/inventory/:idBarang`,[verifyToken, verifyRole(["ADMIN"])], deleteInv),
app.put(`/inventory/:idBarang`, [verifyEditInv, verifyToken, verifyRole(["ADMIN", "USER"])], updateInv),
app.get(`/inventory/`,[verifyToken, verifyRole(["ADMIN", "USER"])], getAllInv)
app.get(`/barang/:idBarang`, [verifyToken, verifyRole(["ADMIN", "USER"])], getBarangById)


export default app