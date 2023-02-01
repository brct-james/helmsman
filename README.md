# Helmsman

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.3.

## MAIN TODO

### DONE

- #SystemWaypoints and #WaypointDetailsList should be combined ultimately - keep WaypointDetailsList
- Fix issues with system batching
- Add ships to waypoint detail panel
- Add system category for no system waypoints (uninitialized)

### ON DECK

- Check getWaypointsMessage is always being set as intended
- Add favorite/unfavorite button (maybe a star?) - instead of category maybe use a symbol instead
- Add click to open ship functionality in starmap waypoint details after creating logic for f/<ship-id> routes

### IN STARMAP

- Mouseover should show name of the system and coordinates (maybe always show coordinates of the mouse).
- Dots should be colored based on category based on whether have detailed information available either via probe or some other thing, and maybe another category for surveyed/not.
- Does update chart do anything?
- Also need a button to zoom to your a selected ship
- Also need a button to switch to in-system view instead of galaxy view
- Add system category for hasShip
- Once trait descriptions are populated, add a click to display to the starmap
- Generalize ratelimit stuff from api::getAllSystems
- Add search for starmap with dropdown of all systems alphabetized
  - Selects the target in the detail panel
  - If possible selects the target in the map panel
- Create loading overlay component
  - Toggle on while getAllSystems is running if on starmap
  - Should still allow access to other tabs

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
