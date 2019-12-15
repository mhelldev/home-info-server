import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
let Parser = require('rss-parser');

interface RssFeed {
    title: string
    date: string
}
export class RssEndpoints {

    public getRssFeedData(): Promise<RssFeed> {
        return new Promise<RssFeed>(async resolve => {
            let parser = new Parser();
            let feed = await parser.parseURL('https://www.spiegel.de/schlagzeilen/index.rss');
            let latest: RssFeed = {
                title: 'undefined',
                date: 'undefined'
            }
            if (feed && feed.items[0]) {
                latest = {
                    title: feed.items[0].title,
                    date: feed.items[0].pubDate
                }
            }
            resolve(latest)
        })
    }

    public getRssFeed = async (req: Request, res: Response, next: NextFunction) => {
        console.log('rss feed requested...')
        try {
            res.json(this.getRssFeedData())

        } catch (err) {
            next(err)
        }
    }
}
