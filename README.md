# Matt French | Stock Simulator
This is a [Next.js](https://nextjs.org/) project using React, TypeScript, and TailwindCSS.
Read my full blog post over on [Medium](https://medium.com/@matt.a.french/building-a-stock-simulator-website-using-nextjs-react-b0c204f47681).

![Preview of the website](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*OQg8nyEycVNUVO5bkKdstg.png)

## The objective
My goal for this project was to create a small visualisation tool for the statistical analysis work I did in my [stock-sim]() project.
The idea is to fetch data from an external API, display historical data, run a simulation on the frontend, and then visualise the prediction.

## Where it's hosted
Currently the website runs on Vercel and deployments are managed by the built-in CI/CD pipeline.
You can view the website at [stocks.mattfrench.dev](https://stocks.mattfrench.dev).

## The Issue
My main issue is data. I need to pull stock information from an API (for which I chose twelvedata) both the create the simulation and to show historical data on the graph. The issue with this is rate limits, because I don’t want to spend huge amounts on API keys, but want to potentially support several users making requests at the same time, I’m had to find a way around the 8-requests-per-minute limit.

## The Solution
Caching. The easiest way to get around the limits is to cache data on the backend in a form of database, then when a user makes a request to our API, we either fetch from the cache or go to the twelvedata API.
At the time of writing, Vercel have just launched 4 new datastores, one of which being a Redis wrapper (known as Vercel KV) which will be perfect for our application.
