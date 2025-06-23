import { default as gist } from './core-app/api/gist.js'
import { default as pin } from './core-app/api/pin.js'

export default async (req, res) => {
    const url = new URL(req.url, 'https://localhost')
    req.query = Object.fromEntries(url.searchParams.entries())
    switch(url.pathname) {
        case '/gist':
            gist(req, res)
            break
        case '/pin':
            pin(req, res)
            break
        default:
            res.statusCode = 404
            res.end('Not Found')
            break
    }
}
