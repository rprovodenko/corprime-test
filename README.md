# corprime-test

[Go to Usage](#usage)

## Introduction

The task is open ended. Because a solution is judged in terms of the problem it solves, I've invented a (somewhat contrived) legend.

This is a financial system, akin to the kind of UI's you might see on an online exchange. 

On such an exchange you may get different kinds of graphs (candlestick, averages based on volume, etc etc). 

As I've learned, there is a type of graph that displays prices of only the last trades that were made within a given time unit (i.e. if a few thousand trades happened in a given second, it only displays the value of the last trade in that second - for every second).

What I've made is a system that receives real time data about crypto trades directly from the exchange and outputs that data graphically in a UI in real time. I have implemented the type of graph mentioned above as a demo, but other kinds of graphs (like candlestick) can be easily added.

## Design

There are 3 basic components:
- backend
- synthetic data sender that simulates the exchange where those trades originate
- UI

## Design of the backend

- 2 websocket endpoints:
    - ingest: receives information about every trade that happened on the exchange in real time
    - monitor: sends information needed to display a graph to the UI. Right now, it's two types of graphs (two types of events):  last trade price per second, last trade price per minute

The two endpoints are internally connected by a bridge:
- ingest gateway emits an event for every new trade received
- the bridge listens to said event and pipes it into streams
- currently there are two streams: one that emits last trade for every second, and one that emits last trade for every minute. It would be close to trivial to implement additional streams for other kinds of real time graphs, e.g. candlestick. 
- the bridge iterates through the streams and pushes trade events onto the monitor gateway
- the monitor gateway sends those events to the UI


## Synthetic data sender

Synthetic data sender:
- generates synthetic trades
- sends them to the ingest endpoint of the backend

It doesn't aim to generate trades that are plausible from real life/financial/historical point of view. It simply generates a kind of a sin graph with some noise.

There are two modes of operation of the synthetic data sender. In both modes it generates a trade every 0-9 ms of real time. However:
- in normal mode: First trade starts at real-time time. Uses real time timestamps (simulates a real time scenario). 1 real time second = 200 trades that happened within the same second.
- in speedrun mode: Takes an arbitrary start date. Synthetic time "flows" faster. 1 real time second = 200 trades that happened within consecutive 100 seconds.

The speedrun mode is used to stress test the UI as it is updated 100 times faster.

## Design of the UI

- two graphs selectable via dropdown (Price of the last trade for every second and for every minute)
- chart is rendered on canvas for performance
- the time window (and hence the amount of data points) is limited by 1 hour for the "seconds" graph and 1 day for the "minutes" graph. 
- every data point for the graphs comes from the backend separately. However, data points are buffered every 20 ms and the graph is updated in batch. It doesn't matter for the real time mode (it's 1 data point per second), but for the speedrun it does. Furthermore, it future proofs the solution by proving that it can support faster data streams.

## Discussion on performance

Humans are slower than computers and I'm not sure if it would make sense to build graphs that display data in sub-second speed (although my solution can do that).
Furthermore I'm not sure how useful it would be to display more data points (longer time windows) on the graph. If user is zooming out he likely wouldn't see more value is higher detailization. If user is zooming in, then he's reducing the time window (and hence the amount of data points).

In any case, there are a number of different techniques that can be used for further optimisation, but I would need to know the use case we're optimising for.

Maybe sometimes there are spikes that would be lost if the level of detailization is too small (e.g. a minute, instead of a second) - (?)

## Notes on the backend design

**Ingestion gateway assumes that trades are ingested in non-decreasing order timestamp-wise. Older trades are ignored.**

**The streams wait for all of the second's/minute's trades to come before emitting the last trade of the second or of the minute. So if the data suddenly stops flowing into ingest there may still be unemitted last trades left inside the stream. This is by design (you can't know if this trade is the last trade of the second until you've received all trades of the second).**

**Trades have "ticker" property, but currently non-"BTC" trades are ignored during ingest. There are also assumptions in the code that pertain to the type of cryptocurrency and the type of fiat currency (USD is assumed). This is a demo limitation.**

## Notes and TODO's
- backend. In real life there would be some kind of storage:
    - for durability of the ingested data. For this we'd need some kind of real time message bus with durability guarantees.
    - for serving users. For this we'd need a database, timeseries optimised.
        - there would also probably be an in memory data store for data that has been already processed by streams but not yet committed to disk. But this all depends on the requirements.

### Other TODO's
Functionality:
- There is the "ticker" property on trade objects, which currently is only allowed to be "BTC", and fiat currency is assumed to be USD. Of course in real life you would have other values there.
- I'm not going to list all the possible domain specific things that I missed, like the fact that volume is an important metric and probably a many other domain specific things I'm not aware of. 
- Security is totally ignored currently, even TSL is not used, not even mentioning authentication and other things
- There is no mobile version


Code:
- make into monorepo
    - synthetic trade sender becomes a separate package
    - client code and types becomes a separate package, shared between backend and UI and synthetic trade sender
- tests:
    - e2e tests for UI
- CI/CD/IaC


- backend: in real life there would be some kind of storage solution. 
    - The streams solution is still good
    - I would probably have an in memory buffer for recent data that I would commit asynchronously to on-disk storage 
    - Users would still be served from memory for recent (real time and a little older) data points and from on-disk storage (a database) for older/historical lookups
- scalability: 
- synthetic data is unrealistic, try feeding real data


## Usage

For demo go to  <...>


### Local deployment
Probably not necessary, but that's the version it's been tested with:
```
nvm use 22 
```
Start backend:
```
cd backend
npm i
npm run test # will take 2-3 minutes
npm run start:dev
```
Start sending synthetic trades:
```
cd backend
npm run run-sender # or 
npm run run-sender:speedrun # for a stress test
```
Start the UI:
```
cd ui
npm i
npm run dev
```

Then go the the UI that's been output in the console.


TODO

Deployment:
- UI: DO cdn 
- backend: DO VPS
- terraform?

