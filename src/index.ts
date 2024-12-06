import express from 'express'
import cors from 'cors'
import userRoute from './route/routeUser'
import barangRoute from './route/routeInv'
import borrow from './route/routeBorrow'

const PORT: number = 4000
const app =  express()
app.use(cors())

app.use(`/api`, userRoute)
app.use('/api', barangRoute)
app.use('/api', borrow)

app.listen(PORT, () => {
    console.log(`Server Berjalan Di Port ${PORT}`)
})