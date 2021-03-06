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
    color: string
    warning: boolean
}

let  dates: WasteDate[] = []

export class WasteDateEndpoints {

    constructor() {

         let data = ical.parseFile(__dirname + '/resources/DUS_Abfuhrtermine_Stand_20201228.ICS', (err: any, data: any[]) => {
             if (err) console.log(err);
             for (let k in data) {
                 if (data.hasOwnProperty(k)) {
                     var ev = data[k];
                     if (data[k].type == 'VEVENT') {
                         let type = ev.summary
                         let color = ''
                         let warning = false
                         if (moment(ev.start).diff(moment(),'days') <= 1) {
                             warning = true
                         }
                         if (type.indexOf('Bio') >= 0) {
                             type = 'Bio'
                             color = '#b0591f'
                         }
                         if (type.indexOf('Leicht') >= 0) {
                             type = 'Gelb'
                             color = '#f7d117'
                         }
                         if (type.indexOf('Rest') >= 0) {
                             type = 'Rest'
                             color = '#9a9a9a'
                         }
                         if (type.indexOf('Altpapier') >= 0) {
                             type = 'Papier'
                             color = '#1f76b0'
                         }
                         dates.push({
                             warning,
                             type,
                             color,
                             date: moment(ev.start).utc(true),
                             dateSimple: moment(ev.start).utc(true).format('DD.MM'),
                             day: moment(ev.start).locale("de").utc(true).format('dd'),
                         })
                     }
                 }
             }
         });
    }

    public getNextDateData(): Promise<WasteDate> {
        return new Promise<WasteDate>(resolve => {
            dates.sort((a: WasteDate ,b:WasteDate) => {
                return a.date.diff(b.date)
            })
            resolve(dates.filter((d) => {
                return d.date.isAfter(moment().utc(true))
            })[0])
        })
    }

    public getNextDate = async (req: Request, res: Response, next: NextFunction) => {
        console.log('waste date requested...')
        try {
            res.json(await this.getNextDateData())
        } catch (err) {
            next(err)
        }
    }
}
