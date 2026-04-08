import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import WebsiteController from '../../../DataBase/WebsiteController.js'
const WebsiteListServer = (app) => {
    app.tokenPost("/updateWebsiteList", async (req, res, user) => {
        const { data, websiteId } = req.body
        const result = await WebsiteController.updateWebsiteList(data, websiteId)
        return res.json(result)
    })

    app.tokenPost("/getWebsiteListById", async (req, res, user) => {
        const { id } = req.body
        
        const result = await WebsiteController.getWebsiteData(id)
        return res.json(result)
    })

    app.tokenPost("/createWebsiteList", async (req, res, user) => {
        const { data, websiteId } = req.body
        const result = await WebsiteController.createWebsiteList(data, websiteId)
        return res.json(result)
    })

    app.tokenPost("/deleteWebsiteList", async (req, res, user) => {
        const { id, websiteId } = req.body
        const result = await WebsiteController.deleteWebsiteList(id, websiteId)
        return res.json(result)
    })
}

export default WebsiteListServer