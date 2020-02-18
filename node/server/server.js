
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let serverFable = require("./fableImports/serverFable.js")

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if(!pathname.endsWith(".js") && !pathname.includes("_next"))
    {
        console.log("RECEIVED REQUEST FOR: " + pathname);    
        serverFable.serverFable.callRPC("msg");
    }
    
    handle(req, res, parsedUrl)
    console.log("returning from server");
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
