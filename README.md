# Spaceboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.

This is a dashboard for the game [Space Traders](https://spacetraders.io), and is built on the [JS/TS SDK maintained by notVitaliy](https://github.com/notVitaliy/spacetraders-io)

## Features

- Automatically registers new account if username available
- Saves username, token, and net worth history locally (page must be active to populate net worth history automatically)
- Plots Credits over Time (5 minute logging intervals)
- Provides an overview of all ships in player fleet, including their stats and location/flight plan

## Roadmap / TODO

- Fleet Overview
- - Overview
- - Automation (For entire fleet - per ship automation is handled by cards)
- - \[Started] Cards
- - - \[Done] Show ship innate stats, values like fuel and cargo, location, etc.
- - - Flight Plan should lookup start, dest, and eta from flight plan api
- - - Auto-Update Toggle (Sync with settings page): cause won't necessarily always need to have the latest 10s update on the ships, useful for saving calls/bandwidth when it may only be desirable to req updates manually - also allow configuring the auto-update speed in settings (update method in interval service)
- - - Badge Component (generic badge constructor for class, tags, type, etc.)
- - - Individual Automation
- - - Individual ship page with detailed cargo manifest and maybe even action log
- - - ShipStatus section should show the appropriate planet icon when docked (along with location x/y), appropriate ship flying gif when not (along with eta/start/dest)
- Interval service should only run interval items if the current path is relevant (accInfo would be '/' scope, while allShips is '/f/') to save calls & bandwidth
- \[Started: interval-service now supports countdowns] Display interval countdowns (for those using interval-service), allow manual refresh of account info
- Placeholder/loading message while waiting for fleet list (ship-cards) to populate
- Login Page, force redirect here until suceeed login (tries cached credentials before redirect)
- Ship nicknaming & tagging (use ship ID, join with local object containing name and tag array) - will need to change shipName to input tag, add shipType
- Fleet search, sort, filter based on name/tags, as well as ship info like class/type/speed/weapons/etc.
- Add setting for auto-changing fleet-overview layout at certain # of ships (from showing all to showing summaries by tag or maybe other configurable layouts... - add /f/all-ships)
- Net Worth chart will have different time scale and interval presets for visualization (30 min/5 min, 3 hr/30 min, 1 day/4 hr, etc.)
- Net Worth chart will be expanded to separately display liquid credits, assets (bank tab will also feature sub-categorization of ship value, cargo, structures, etc.) debt, and actual calculated net worth. These would be togglable in the visualization.
- Numeric values for each net worth stat next to chart in a neat table
- GUI-accessible automation **Plans**. Import/export/edit as text as well for ease of use. Support for conditionals, considering galactic market data, calculating route/margin efficiency, auto-scout market data, etc. (e.g. if value of X too low change to Y plan, if A route/commodity becomes more profitable than current plan change plans, etc.)
- Integration with Captains-log: accesses the exposed API and allows use of remote longitudinal data preferentially over local. Would work with any other data-logging service that implements the API
- Optimize performance
- Implement API req queue (also rework api service & use with callbacks) (also Ensure no unnecessary saving to localstorage outside of intervals)
- Net Worth Chart MkII (migrate to interval service)
- Re-evaluate ship card UI

## Related Projects

- **\[Not-Started]** Starscript: A customizable automation script for SpaceTraders.io. Can use the same **Plans** as Spaceboard, and/or simply pass game data to/from custom functions. Can be optionally configured to sync **Plans** with Spaceboard.
- **\[Not-Started]** Captains-log: A tool for automatic logging of longitudinal data for SpaceTraders.io. Integrates with Spaceboard by optionally exposing access to the logged data via API.

---

## Development server

Run `ng serve` for a dev server.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
