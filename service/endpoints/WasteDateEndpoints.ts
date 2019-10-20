import { NextFunction, Request, Response } from 'express'
const ical = require('node-ical');
var moment = require('moment')
import { Moment } from 'moment'

type WasteType = 'Rest' | 'Gelb' | 'Bio' | 'Papier'

interface WasteDate {
    type: string
    date: Moment
    dateSimple: string
    day: string
}

let  dates: WasteDate[] = []

export class WasteDateEndpoints {

    constructor() {

         let data = ical.parseFile(__dirname + '/resources/DUS_Abfuhrtermine_Stand_20190930.ICS', (err: any, data: any[]) => {
             if (err) console.log(err);
             for (let k in data) {
                 if (data.hasOwnProperty(k)) {
                     var ev = data[k];
                     if (data[k].type == 'VEVENT') {
                         let type = ev.summary
                         if (type.indexOf('Bio') >= 0) {
                             type = 'Bio'
                         }
                         if (type.indexOf('Leicht') >= 0) {
                             type = 'Gelb'
                         }
                         if (type.indexOf('Rest') >= 0) {
                             type = 'Rest'
                         }
                         if (type.indexOf('Altpapier') >= 0) {
                             type = 'Papier'
                         }
                         dates.push({
                             type,
                             date: moment(ev.start).utc(true),
                             dateSimple: moment(ev.start).utc(true).format('DD.MM'),
                             day: moment(ev.start).utc(true).format('ddd'),
                         })
                     }
                 }
             }
         });
    }

    public getNextDate = async (req: Request, res: Response, next: NextFunction) => {
        console.log('waste date requested...')
        try {
            dates.sort((a: WasteDate ,b:WasteDate) => {
                return a.date.diff(b.date)
            })
            res.json(dates.filter((d) => {
                return d.date.isAfter(moment().utc(true))
            })[0])
        } catch (err) {
            next(err)
        }
    }
}
