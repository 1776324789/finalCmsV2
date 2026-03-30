import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

const WebsiteListServer = (app, DB) => {
    app.tokenPost("/updateWebsiteList", async (req, res, user) => {
        const { data, targetWebsite } = req.body
        return await res.json(DB.updateWebsiteList(data, targetWebsite))
    })

    app.tokenPost("/getWebsiteListById", async (req, res, user) => {
        const { id } = req.body
        const result = await DB.getWebsiteData(id)
        return res.json(result)
    })
}

export default WebsiteListServer