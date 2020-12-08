import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
const {StringStream} = require("scramjet");
const request = require("request");


interface CovidValues {
    sevenVal: string
    kreis: string
}
export class CovidEndpoints {

    private feedIndex: number = 0

    public getSevenVal = async (req: Request, res: Response, next: NextFunction) => {
        console.log('covid data requested...')
        try {
            res.json(await this.parseCSV())
        } catch (err) {
            next(err)
        }
    }

    private parseCSV(): Promise<CovidValues> {
        return new Promise<CovidValues>(async resolve => {

            request.get("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.csv")
                .pipe(new StringStream())
                .CSVParse()
                .consume((object:any) => {
                    if (object[7] === 'Düsseldorf') {
                        resolve({
                            sevenVal: object[37],
                            kreis: object[7]
                        })
                    }
                })
        })
    }


}
