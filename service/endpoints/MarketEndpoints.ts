import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'

interface Market {
    location: string
    date: string
}
export class MarketEndpoints {

    public getMarketsData(): Promise<Market[]> {
        return new Promise(resolve => {
            let markets: Market[] = [
                {
                    location: 'Radschläger',
                    date: '08.12'
                },
                {
                    location: 'Kindertrödel JAB',
                    date: '14.12'
                }]
            resolve(markets)
        })

    }
    public getMarkets = async (req: Request, res: Response, next: NextFunction) => {
        console.log('market dates requested...')
        try {
            res.json(await this.getMarketsData())
        } catch (err) {
            next(err)
        }
    }
}