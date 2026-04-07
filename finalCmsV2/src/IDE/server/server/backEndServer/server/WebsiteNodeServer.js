import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import WebsiteController from '../../../DataBase/WebsiteController.js'
const WebsiteNodeServer = (app) => {
    app.tokenPost("/getNodeContent", async (req, res, user) => {
        const { nodeId, websiteId } = req.body
        return res.json({})
    })
}

export default WebsiteNodeServer