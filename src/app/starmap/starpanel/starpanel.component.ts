import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import {
  Waypoint,
  SystemWaypoint,
  Ship,
  WaypointOrbital,
  WaypointTrait,
  WaypointType,
} from 'spacetraders-v2-ng';

@Component({
  selector: 'app-starpanel',
  templateUrl: './starpanel.component.html',
  styleUrls: ['./starpanel.component.sass'],
})
export class StarpanelComponent {
  @Input() systemSymbol: string | undefined;
  @Input() systemX: number | undefined;
  @Input() systemY: number | undefined;
  @Input() systemCategory: string | undefined;
  @Input() systemWaypoints: SystemWaypoint[] | undefined;

  systemWaypointsMessage: string = '';

  waypoints: Record<string, Waypoint> | undefined;
  numWaypoints: number = 0;
  getWaypointsMessage: string = '';

  activeWaypoint: string = '';
  activeWaypointDetails: Waypoint | undefined;

  shipsAtWaypoint: Ship[] = [];

  get stringifiedSystemSymbol(): string {
    return this.systemSymbol || '';
  }

  get stringifiedWaypointSymbol(): string {
    return this.activeWaypointDetails ? this.activeWaypointDetails.symbol : '';
  }

  constructor(public api: ApiService) {}

  async getWaypoints() {
    // Reset
    this.getWaypointsMessage = '';
    this.waypoints = undefined;
    this.activeWaypoint = '';
    this.shipsAtWaypoint = [];

    if (this.systemSymbol == '' || this.systemSymbol == undefined) {
      console.log(
        '[starpanel-comp] No system selected, skipping get waypoints'
      );
      this.getWaypointsMessage = 'No system selected';
      return;
    }

    await this.api.getSystemWaypoints(this.systemSymbol);

    let wptsRecord: { systems: Record<string, Waypoint[]>; timestamp: string } =
      this.api.retrieveLocally('waypoints');

    // If the data is 5 minutes stale (300000 millis), refresh it
    // if (
    //   new Date().getTime() - new Date(wptsRecord.timestamp).getTime() >=
    //   300000
    // ) {
    //   await this.api.getSystemWaypoints(this.systemSymbol);
    // }

    if (this.systemSymbol in wptsRecord.systems) {
      this.numWaypoints = wptsRecord.systems[this.systemSymbol].length;
      if (this.numWaypoints > 0) {
        for (let waypoint of wptsRecord.systems[this.systemSymbol]) {
          if (this.waypoints == undefined) {
            this.waypoints = {};
          }
          this.waypoints[waypoint.symbol] = waypoint;
        }
        this.getWaypointsMessage = 'Click a row to show waypoint detail panel';
      } else {
        this.getWaypointsMessage =
          'Received empty response from server, is this system initialized?';
      }
    } else {
      this.getWaypointsMessage = 'Could not get waypoint details from server';
    }
  }

  animateCopySymbol: Record<string, boolean> = {};
  copySymbolEvent(key: string) {
    this.animateCopySymbol[key] = true;
    setTimeout(() => {
      this.animateCopySymbol[key] = false;
    }, 100);
  }

  doesWaypointHaveShip(wptSymbol: string): boolean {
    let fleet: { ships: Ship[] } = this.api.retrieveLocally('fleet');
    if (!fleet.ships) {
      return false;
    }
    for (let ship of fleet.ships) {
      if (ship.nav.waypointSymbol == wptSymbol) {
        return true;
      }
    }
    return false;
  }

  updateShipsAtWaypoint(wptSymbol: string) {
    if (wptSymbol.length == 0) {
      this.shipsAtWaypoint = [];
    }
    let fleet: { ships: Ship[] } = this.api.retrieveLocally('fleet');
    let atWpt: Ship[] = [];
    for (let ship of fleet.ships) {
      if (ship.nav.waypointSymbol == wptSymbol) {
        atWpt.push(ship);
      }
    }
    this.shipsAtWaypoint = atWpt;
  }

  activateDetailPanel(wptSymbol: string) {
    this.activeWaypoint = wptSymbol;
    if (this.waypoints != undefined) {
      this.activeWaypointDetails = this.waypoints[wptSymbol] || undefined;
    } else {
      this.activeWaypointDetails = undefined;
    }
    this.updateShipsAtWaypoint(wptSymbol);
    console.log(this.activeWaypoint);
  }

  linkToShipInFleetPage(shipSymbol: string) {
    // TODO: This
    console.log(
      '[starpanel-component::linkToShipInFleetPage] TODO: This: symbol:',
      shipSymbol
    );
    return;
  }

  isWaypointActive(wptSymbol: string): boolean {
    return wptSymbol == this.activeWaypoint;
  }

  getActiveOrbitals(): WaypointOrbital[] {
    if (this.activeWaypointDetails == undefined) {
      return [];
    }
    return this.activeWaypointDetails.orbitals;
  }

  getActiveTraits(): WaypointTrait[] {
    if (this.activeWaypointDetails == undefined) {
      return [];
    }
    return this.activeWaypointDetails.traits;
  }

  getWaypoint(waypointSymbol: string): Waypoint {
    if (this.waypoints && this.waypoints[waypointSymbol]) {
      return this.waypoints[waypointSymbol];
    }
    return {
      symbol: '',
      type: WaypointType.Planet,
      systemSymbol: '',
      x: 0,
      y: 0,
      orbitals: [],
      traits: [],
    };
  }

  getSortedWaypointsArray(): Waypoint[] {
    if (this.waypoints == undefined) {
      return [];
    }
    let res: Waypoint[] = Object.values(this.waypoints).sort((a, b) => {
      let a_coords = `(${a.x}, ${a.y})`;
      let b_coords = `(${b.x}, ${b.y})`;
      if (b_coords > a_coords) return 1;
      if (b_coords < a_coords) return -1;
      return 0;
    });
    return res;
  }

  ngOnChanges() {
    this.getWaypointsMessage = '';
    this.waypoints = undefined;
    this.activeWaypoint = '';
    this.getWaypoints();
  }
}
