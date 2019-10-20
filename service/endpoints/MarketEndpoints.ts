import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'

interface Market {
    location: string
    date: string
}
export class MarketEndpoints {

    public getMarkets = async (req: Request, res: Response, next: NextFunction) => {
        console.log('market dates requested...')
        try {
            let markets: Market[] = [
                {
                    location: 'Messe',
                    date: '03.11'
                },
                {
                    location: 'Radschläger',
                    date: '10.11'
                }]
            res.json(markets)
        } catch (err) {
            next(err)
        }
    }
}