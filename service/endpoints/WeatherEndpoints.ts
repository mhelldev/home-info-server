import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
var weather = require('weather-js');
var moment = require('moment')
import { Moment } from 'moment'

interface Weather {
    temp: string
    tempTomorrow: string
    name: string
    code: string
    date: string
    feelslike: string
    windspeed: string
    humidity: string
}
export class WeatherEndpoints {

    public postWeatherData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(Date.now().toString())
            console.log(req.body)
            res.sendStatus(HttpStatus.OK)
        } catch (err) {
            next(err)
        }
    }

    public getWeatherData(): Promise<Weather>{
        return new Promise((resolve, reject ) => {
            weather.find({search: 'Düsseldorf, Germany', degreeType: 'C'}, (err: any, result: any) => {
                if(err) {
                    console.log(err);
                }
                let w: Weather = {
                    temp: "undefined",
                    tempTomorrow: "undefined",
                    name: "undefined",
                    code: "undefined",
                    date: "undefined",
                    feelslike: "undefined",
                    windspeed: "undefined",
                    humidity: "undefined",
                }
                if (result && result[0]) {
                    let date = result[0].current.date
                    let yearIndex = date.indexOf('-')
                    date = date.slice(yearIndex + 1)
                    let wind = result[0].current.winddisplay
                    let windDirectionIndex = wind.indexOf("h")
                    wind = wind.slice(0, windDirectionIndex + 1)

                    w = {
                        temp: result[0].current.temperature + "°",
                        tempTomorrow: result[0].forecast[2].shortday +": " + result[0].forecast[2].high + "°",
                        name: result[0].current.shortday,
                        code: result[0].current.skycode,
                        date: moment().utc(true).format('ddd DD.MM'),
                        feelslike: result[0].current.feelslike + "°",
                        windspeed: wind,
                        humidity: result[0].current.humidity + "%",
                    }
                }
                console.log('weather resolved...')
                resolve(w)
            })
        });
    }

    public getWeather = async (req: Request, res: Response, next: NextFunction) => {
        console.log('weather data requested...')
        try {
            res.json(await this.getWeatherData())

        } catch (err) {
            next(err)
        }
    }
}
