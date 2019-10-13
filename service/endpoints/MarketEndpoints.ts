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
                    location: 'Radschägermarkt',
                    date: '2019.10.13'
                },
                {
                    location: 'Radschlägermarkt',
                    date: '2019.11.10'
                },
                {
                    location: 'Radschlägermarkt',
                    date: '2019.12.08'
                }]
            res.json(markets)
        } catch (err) {
            next(err)
        }
    }
}