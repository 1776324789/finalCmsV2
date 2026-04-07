import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import WebsiteController from '../../../DataBase/WebsiteController.js'
const WebsiteNodeServer = (app) => {
    app.tokenPost("/getNodeContent", async (req, res, user) => {
        const { nodeId, websiteId } = req.body
        const result = await WebsiteController.getNodeContent(nodeId, websiteId)
        return res.json(result)
    })

    app.tokenPost("/updateNode", async (req, res, user) => {
        const { node, websiteId } = req.body
        const result = await WebsiteController.updateNode(node, websiteId)
        return res.json(result)
    })

    app.tokenPost("/createNode", async (req, res, user) => {
        const { node, websiteId, listId } = req.body
        const result = await WebsiteController.createNode(node, websiteId, listId)
        return res.json(result)
    })

    app.tokenPost("/deleteNode", async (req, res, user) => {
        const { nodeId, websiteId } = req.body
        const result = await WebsiteController.deleteNode(nodeId, websiteId)
        return res.json(result)
    })
}

export default WebsiteNodeServer