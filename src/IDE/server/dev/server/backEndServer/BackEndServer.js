import express from 'express'
import cors from 'cors'
import LoginServer from './server/LoginServer.js'
const BackEndServer = (DB) => {
    const app = express()
    const PORT = 5174

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get('/health', (req, res) => {
        res.json({ status: '200' })
    })

    app.listen(PORT, () => {
        console.log(`CMS backend running at http://localhost:${PORT}`)
    })


    LoginServer(app, DB)
    return app
}

export default BackEndServer
