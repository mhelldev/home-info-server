import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
const https = require('https')

interface TrainConnection {
    line: string
    destination: string
    minutes: string
}
export class TrainEndpoints {

    public getTrainConnections = async (req: Request, res: Response, next: NextFunction) => {
        console.log('train connections requested...')
        try {
            let data = ''
            let responseData: TrainConnection[] = []
            https.get('https://vrrf.finalrewind.org/D%C3%BCsseldorf/Eckenerstra%C3%9Fe.json?frontend=json&no_lines=4',
                (resp: any) => {

                    resp.on('data', (chunk: any) => {
                        data += chunk
                    })
                    resp.on('end', () => {
                        data = JSON.parse(data).preformatted.forEach(
                            (entry:any) => {
                                responseData.push(
                                    {
                                        line: entry[0],
                                        destination: entry[1],
                                        minutes: entry[2]
                                    })
                            }
                        )
                        res.json(responseData)
                    })

                }).on('error', (err: any) => {
                next(err)
            })
        } catch (err) {
            next(err)
        }
    }
}
