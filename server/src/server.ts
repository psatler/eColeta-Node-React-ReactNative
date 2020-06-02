import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use(routes)

// route to server static files, serving the folder where these files are located
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3333)