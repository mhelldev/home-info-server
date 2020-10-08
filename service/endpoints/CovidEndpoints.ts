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

            request.get("https://pavelmayer.de/covid/risks/data.csv")
                .pipe(new StringStream())
                .CSVParse()
                .consume((object:any) => {

                    if (object [1] === 'SK Düsseldorf') {
                        console.log(object[1])
                        console.log(object[16])
                        resolve({
                            sevenVal: object[16],
                            kreis: object[1]
                        })
                    }
                })  // do whatever you like with the objects
                .then(() => {
                    console.log("all done")
                    resolve({sevenVal: '', kreis: ''})
                })
        })
    }


}
