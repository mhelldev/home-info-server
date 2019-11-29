import {WeatherEndpoints} from "./service/endpoints/WeatherEndpoints";
import {WasteDateEndpoints} from "./service/endpoints/WasteDateEndpoints";
import {TrainEndpoints} from "./service/endpoints/TrainEndpoints";
import {RssEndpoints} from "./service/endpoints/RssEndpoints";
import {MarketEndpoints} from "./service/endpoints/MarketEndpoints";

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

app.use(cors());

app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')

app.listen(port, function () {
    console.log('Example app listening on port !')
})

app.get('/', async (req: any, res: any) => {
    console.log(await weatherEndpoints.getWeatherData())
    res.render('index')
})

app.get('/api/weather/', weatherEndpoints.getWeather)
app.get('/api/waste/', wasteDateEndpoints.getNextDate)
app.get('/api/train/', trainEndpoints.getTrainConnections)
app.get('/api/rss/', rssEndpoints.getRssFeed)
app.get('/api/market/', marketEndpoints.getMarkets)