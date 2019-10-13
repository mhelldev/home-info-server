import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
var weather = require('weather-js');

interface Weather {
    temp: string
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

    public getWeather = async (req: Request, res: Response, next: NextFunction) => {
        console.log('weather data requested...')
        try {
            let result
            await weather.find({search: 'Düsseldorf, Germany', degreeType: 'C'}, (err: any, result: any) => {
                if(err) console.log(err);
                let w: Weather = {
                    temp: "undefined",
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
                        name: result[0].current.shortday,
                        code: result[0].current.skycode,
                        date: result[0].current.shortday + " " + date,
                        feelslike: result[0].current.feelslike + "°",
                        windspeed: wind,
                        humidity: result[0].current.humidity + "%",
                    }
                }

                res.json(w)
            });

        } catch (err) {
            next(err)
        }
    }
}
