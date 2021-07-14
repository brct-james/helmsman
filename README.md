# Helmsman

This is a dashboard for the game [Space Traders](https://spacetraders.io), and is built on the [JS/TS SDK maintained by notVitaliy](https://github.com/notVitaliy/spacetraders-io)

## Notice

The current version of notVitaliy/spacetraders-io on npm is not correctly propagating errors when registering an account. Please see the following PR for the fix until it is patched (not critical to functionality, only relevant to displaying the issue on the login screen).

## Features

- Automatically registers new account if username available
- Saves username, token, and net worth history locally (page must be active to populate net worth history automatically)
- Plots Credits over Time (5 minute logging intervals)
- `abbrNum` pipe shows numbers in an easy to read format, falls back to scientific notation for numbers above 999.99b (see credits)
- Fleet Overview
- - Automatically refreshes fleet status, can be toggled off (can still be refreshed manually) or changed to a different interval
- - Ship Cards (Fleet List)
- - - Show manufacturer, ship stats (inc. inventory restrictions like on the tanker ship), location/flight plan & eta, and ship ID
- - - - `ArrivalEta` pipe can be used to format a datetime string into an easy to read trip duration. Pass an update timer variable as an argument to have the ETA countdown refresh automatically

## Changelog

### v0.1.8

- Added badge component (generic badge constructor for ship class, tags, type, etc., also used for displaying resources [e.g. coins, ship count, struct count, etc.] in a convenient and visually pleasing manner)

### v0.1.7

- Added `@angular/material`
- Added logic for disabling intervals in `interval-service`
- Added `settings-service` to handle app-wide settings
- Added slider toggle for fleet refresh in settings & fleet-overview
- NavBar now hides on login page (when not logged in)
- Added 1em margin around main content
- Added fleet update interval setting

### v0.1.6

- Added login page, logic for handling user session
- AbbrNum pipe now handles unexpected input better
- Changed error messages in account-info.ts

### v0.1.5

- Renamed Spaceboard to Helmsman
- Added changelog to readme ;)
- Added ship-card manufacturer logo (inc. custom Tiddalik logo since there wasn't one in the awesome-spacetraders repo)
- Added indicator for cargo hold restrictions (e.g. the tiddalik tanker ship can only carry fuel)

## Roadmap / TODO

- \[Started] Fleet Overview
- - \[Started] Overview
- - \[Delayed] Automation (For entire fleet - per ship automation is handled by cards)
- - \[Started] Cards
- - - \[Started] Badge Component (generic badge constructor for class, tags, type, etc.)
- - - \[Delayed] Individual Automation
- - - \[Delayed] Individual ship page with detailed cargo manifest and maybe even action log
- Interval service should only run interval items if the current path is relevant (accInfo would be '/' scope, while allShips is '/f/') to save calls & bandwidth
- \[Started: interval-service now supports countdowns] Display interval countdowns (for those using interval-service), allow manual refresh of account info
- Placeholder/loading message while waiting for fleet list (ship-cards) to populate
- Ship nicknaming & tagging (use ship ID, join with local object containing name and tag array) - will need to change shipName to input tag, add shipType
- Fleet search, sort, filter based on name/tags, as well as ship info like class/type/speed/weapons/etc.
- Add setting for auto-changing fleet-overview layout at certain # of ships (from showing all to showing summaries by tag or maybe other configurable layouts... - add /f/all-ships)
- Convert net worth chart x labels to use tick override given timestamps rather than giving literal strings
- Net Worth chart will have different time scale and interval presets for visualization (30 min/5 min, 3 hr/30 min, 1 day/4 hr, etc.)
- Net Worth chart will be expanded to separately display liquid credits, assets (bank tab will also feature sub-categorization of ship value, cargo, structures, etc.) debt, and actual calculated net worth. These would be togglable in the visualization.
- Numeric values for each net worth stat next to chart in a neat table
- GUI-accessible automation **Plans**. Import/export/edit as text as well for ease of use. Support for conditionals, considering galactic market data, calculating route/margin efficiency, auto-scout market data, etc. (e.g. if value of X too low change to Y plan, if A route/commodity becomes more profitable than current plan change plans, etc.)
- Integration with Captains-log: accesses the exposed API and allows use of remote longitudinal data preferentially over local. Would work with any other data-logging service that implements the API
- Optimize performance
- Implement API req queue (also rework api service & use with callbacks) (also Ensure no unnecessary saving to localstorage outside of intervals)
- Net Worth Chart MkII (migrate to interval service)
- Re-evaluate ship card UI
- See about changing how fleet-overview works so ship-card elements aren't regenerated every time shipInfo is refreshed (may not be feasible)
- Add wireframe ship models to the ship card above/below manufacturer logo
- More charts per route (to track profitability, show # of ships on route, market value of route items at endpoints over time, etc.)
- Catch errors in API
- Button for log out
- Migrate to ngx-webstorage's `.observe` method where sensible

## Related Projects

- **\[Not-Started]** Starscript: A customizable automation script for SpaceTraders.io. Can use the same **Plans** as Helmsman, and/or simply pass game data to/from custom functions. Can be optionally configured to sync **Plans** with Helmsman. Customizable kill switch that can be configured for any number of conditions, by default will trigger if run out of credits & on a negative trajectory - or something like that.
- **\[Not-Started]** Space-opera: Either a stand-alone or add-on script for Starscript and Captains-log that makes orchestrating a complex network of ships easier by providing tools for controlling interconnected layers of automation. For example, managing a merchant fleet of fighters/carriers, cargo haulers with different engine speeds, or using an autonomous refueling fleet to increase margins over having haulers buy over-priced fuel at trade destinations. Integrates with a Helmsman module.
- **\[Not-Started]** Captains-log: A tool for automatic logging of longitudinal data for SpaceTraders.io. Integrates with Helmsman by optionally exposing access to the logged data via API.

---

## Development server

Run `ng serve` for a dev server.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
