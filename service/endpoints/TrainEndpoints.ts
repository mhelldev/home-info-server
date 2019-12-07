import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
const https = require('https')

interface TrainConnection {
    line: string
    destination: string
    minutes: string
}
export class TrainEndpoints {

    public getTrainConnectionsData():Promise<TrainConnection[]> {
        return new Promise((resolve,reject)  => {
            let data = ''
            let responseData: TrainConnection[] = []
            https.get('https://vrrf.finalrewind.org/D%C3%BCsseldorf/Eckenerstra%C3%9Fe.json?frontend=json&no_lines=8',
                (resp: any) => {

                    resp.on('data', (chunk: any) => {
                        data += chunk
                    })
                    resp.on('end', () => {
                        data = JSON.parse(data).preformatted.forEach(
                            (entry:any) => {
                                let destination = entry[1].toString()
                                if (destination.length > 14) {
                                    destination = destination.substring(0, 12) + '...'
                                }
                                responseData.push(
                                    {
                                        line: entry[0],
                                        destination: destination,
                                        minutes: entry[2]
                                    })
                            }
                        )
                        resolve(responseData)
                    })

                }).on('error', (err: any) => {
                    console.error(err)
            })
        })
    }

    public getTrainConnections = async (req: Request, res: Response, next: NextFunction) => {
        console.log('train connections requested...')
        try {
            res.json(await this.getTrainConnectionsData())
        } catch (err) {
            next(err)
        }
    }
}
