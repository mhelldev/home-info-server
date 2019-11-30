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
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getUTCHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let dateAndTime = date + "." + month + "." + year + " " + hours + ":" + minutes

    res.render('index', {weather, waste, trains, markets, rssFeed, dateAndTime})
})

app.get('/api/weather/', weatherEndpoints.getWeather)
app.get('/api/waste/', wasteDateEndpoints.getNextDate)
app.get('/api/train/', trainEndpoints.getTrainConnections)
app.get('/api/rss/', rssEndpoints.getRssFeed)
app.get('/api/market/', marketEndpoints.getMarkets)