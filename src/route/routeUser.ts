import express  from "express";
import { addUser, updateUser, getUser, deleteUser, authentication } from "../controller/ctrlUser";
import { verifyAddUser, verifyAuthentication, verifyEditUser } from "../midleware/verifyUser";
import { verifyRole, verifyToken } from "../midleware/authorization"

const app = express()
app.use(express.json())

app.post(`/add`, [verifyAddUser], addUser),
app.post(`/login`,[verifyAuthentication], authentication )
app.delete(`/delete/:idUser`,[verifyToken, verifyRole(["ADMIN"])], deleteUser),
app.put(`/update/:idUser`, [verifyEditUser, verifyToken, verifyRole(["ADMIN", "USER"])], updateUser),
app.get(`/all`,[verifyToken, verifyRole(["ADMIN"])], getUser)


export default app