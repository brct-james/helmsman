# Spaceboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.

This is a dashboard for the game [Space Traders](https://spacetraders.io), and is built on the [JS/TS SDK maintained by notVitaliy](https://github.com/notVitaliy/spacetraders-io)

## Features
+ Automatically registers new account if username available
+ Saves username, token, and net worth history locally (page must be active to populate net worth history automatically)
+ Visualizes Changes in Net Worth

## Roadmap / TODO
+ Troubleshoot: loging in with saved credentials seems to cause a lot of errors - token is undefined :/
+ Ensure refactor of api system for caching user info and account info to localstorage is complete and functionality remains
+ Set up intervals for arciving net worth (5m)
+ Set up interval for refreshing account info (1m)
+ Ensure no unnecessary saving to localstorage outside of intervals
+ Display interval countdowns, allow manual refresh of account info
+ Net Worth chart will have different time scale and interval presets for visualization (30 min/5 min, 3 hr/30 min, 1 day/4 hr, etc.)
+ Login Page, force redirect here until suceeed login (tries cached credentials before redirect)
+ Net Worth chart will be expanded to separately display liquid credits, assets (bank tab will also feature sub-categorization of ship value, cargo, structures, etc.) debt, and actual calculated net worth. These would be togglable in the visualization.
+ Numeric values for each net worth stat next to chart in a neat table
+ GUI-accessible automation **Plans**. Import/export/edit as text as well for ease of use. Support for conditionals, considering galactic market data, calculating route/margin efficiency, auto-scout market data, etc. (e.g. if value of X too low change to Y plan, if A route/commodity becomes more profitable than current plan change plans, etc.)
+ Integration with Captains-log: accesses the exposed API and allows use of remote longitudinal data preferentially over local. Would work with any other data-logging service that implements the API


## Related Projects
+ **\[Not-Started]** Starscript: A customizable automation script for SpaceTraders.io. Can use the same **Plans** as Spaceboard, and/or simply pass game data to/from custom functions. Can be optionally configured to sync **Plans** with Spaceboard.
+ **\[Not-Started]** Captains-log: A tool for automatic logging of longitudinal data for SpaceTraders.io. Integrates with Spaceboard by optionally exposing access to the logged data via API.

---

## Development server

Run `ng serve` for a dev server.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).