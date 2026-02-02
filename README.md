# Foreflight code challenge
Small React SPA for the Foreflight code challenge.  

## Setup
Clone the repo and install deps
`bun install`
Should work just fine with npm as well(node v. 22)
`npm install`  

Have the node api running and spin up the app:
`bun run dev` or `npm run dev`  
The app is not particularly optimized(then there's something to talk about :=)), so you can also run the prod build to mitigate some sluggishness:  
`bun run build` -> `bun run preview`  

## Tests
A very simple end-to-end test for playwright lives in `/tests/` that verifies routes are working  
`npx playwright install`  
`npx playwright test`  
Optionally, to see what was tested:
`npx playwright show-report`

## Navigating the code and project
The project leverages a couple of different dependencies, namely:  
[Tan stack router](https://tanstack.com/router/latest) for the(somewhat limited) file based routing in the app.  
[Tan stack query](https://tanstack.com/query/latest) for handling http requests.
[Material UI](https://mui.com/material-ui/) as a UI library.

#### Project structure  
Top level entries lives in `routes/`  
General re-usable components live in `components/`  
Feature based components live in `features/{feature}/`  
Api routes live in `api/`  
And contexts and hooks are in `context/` and `hooks/` respectively.

#### Features
The app contains  
An overview of aircraft. - `Aircrafts`
 - List of aircraft cards with the ability to search and filter.
 - Crud operations and (a somewhat scuffed) 'favorite' feature.

A Dashboard. - `Dashboard`
 - A very simple stat overview of some numbers.

A favorites list. - `Favorites`
 - List of favorite aircrafts. 

Global
 - Navigation bar and darkmode toggle  
----
OBS: Some features might not be 100% completed and/or performance optimized.
