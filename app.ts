import {WeatherEndpoints} from "./service/endpoints/WeatherEndpoints";
import {WasteDateEndpoints} from "./service/endpoints/WasteDateEndpoints";
import {TrainEndpoints} from "./service/endpoints/TrainEndpoints";
import {RssEndpoints} from "./service/endpoints/RssEndpoints";
import {MarketEndpoints} from "./service/endpoints/MarketEndpoints";
var moment = require('moment')

let express = require('express')
let cors = require('cors');
var path = require('path');
let port = process.env.PORT || 3000
let app = express()
let weatherEndpoints = new WeatherEndpoints()
let wasteDateEndpoints = new WasteDateEndpoints()
let trainEndpoints = new TrainEndpoints()
let rssEndpoints = new RssEndpoints()
let marketEndpoints = new MarketEndpoints()


app.use(cors())
app.use(express.static(path.join(__dirname, '/public')))

app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')

app.listen(port, function () {
    console.log('Example app listening on port !')
})

app.get('/', async (req: any, res: any) => {
    const weather = await weatherEndpoints.getWeatherData()
    const waste = await wasteDateEndpoints.getNextDateData()
    const trains = await trainEndpoints.getTrainConnectionsData()
    const markets = await marketEndpoints.getMarketsData()
    const rssFeed = await rssEndpoints.getRssFeedData()

    const date_ob = new Date()
    const date = moment().locale("de").utc(true).format('DD.MM.YYYY')
    const time = moment().locale("de").utc(true).format('hh:mm').add(1, 'hours')


    res.render('index', {weather, waste, trains, markets, rssFeed, date, time})
})

app.get('/api/weather/', weatherEndpoints.getWeather)
app.get('/api/waste/', wasteDateEndpoints.getNextDate)
app.get('/api/train/', trainEndpoints.getTrainConnections)
app.get('/api/rss/', rssEndpoints.getRssFeed)
app.get('/api/market/', marketEndpoints.getMarkets)