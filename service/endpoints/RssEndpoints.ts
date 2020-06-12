import { NextFunction, Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
let Parser = require('rss-parser');

interface RssFeed {
    title: string
    date: string
}
export class RssEndpoints {

    private feedIndex: number = 0

    public getRssFeedData(): Promise<RssFeed> {
        return new Promise<RssFeed>(async resolve => {
            let parser = new Parser();
            let feed = await parser.parseURL('https://www.spiegel.de/schlagzeilen/tops/index.rss');
            let latest: RssFeed = {
                title: 'undefined',
                date: 'undefined'
            }
            if (feed) {
                if (this.feedIndex >= feed.items.length) {
                    this.feedIndex = 0
                }
                latest = {
                    title: feed.items[this.feedIndex].title,
                    date: feed.items[this.feedIndex].pubDate
                }
                this.feedIndex++
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
