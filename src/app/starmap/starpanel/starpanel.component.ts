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
import { Router } from '@angular/router';
import { StorageService } from 'src/app/storage.service';

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

  waypoints: Map<string, Waypoint> | undefined;
  numWaypoints: number = 0;
  getWaypointsMessage: string = '';

  activeWaypoint: string = '';
  activeWaypointDetails: Waypoint | undefined;

  shipsAtWaypoint: Ship[] = [];
  fleet: Map<string, Ship> = new Map<string, Ship>();

  get stringifiedSystemSymbol(): string {
    return this.systemSymbol || '';
  }

  get stringifiedWaypointSymbol(): string {
    return this.activeWaypointDetails ? this.activeWaypointDetails.symbol : '';
  }

  constructor(public api: ApiService, public storage: StorageService) {
    let retrieved = this.storage.retrieve('fleet');
    if (retrieved == undefined) {
      this.fleet = new Map<string, Ship>();
    } else {
      this.fleet = retrieved.data;
    }
  }

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

    let retrievedWaypoints = this.storage.retrieve('waypoints');
    let wptsRecord: Map<string, Waypoint[]> = retrievedWaypoints
      ? retrievedWaypoints.data
      : new Map<string, Waypoint[]>();

    // If the data is 5 minutes stale (300000 millis), refresh it
    // if (
    //   new Date().getTime() - new Date(wptsRecord.timestamp).getTime() >=
    //   300000
    // ) {
    //   await this.api.getSystemWaypoints(this.systemSymbol);
    // }

    if (wptsRecord.has(this.systemSymbol)) {
      let sysWpts = wptsRecord.get(this.systemSymbol);
      if (sysWpts == undefined || sysWpts.length == 0) {
        this.numWaypoints = 0;
        this.getWaypointsMessage =
          'Received empty response from server, is this system initialized?';
      } else {
        this.numWaypoints = sysWpts.length;
        for (let waypoint of sysWpts) {
          if (this.waypoints == undefined) {
            this.waypoints = new Map<string, Waypoint>();
          }
          this.waypoints.set(waypoint.symbol, waypoint);
        }
        this.getWaypointsMessage = 'Click a row to show waypoint detail panel';
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
    for (let ship of this.fleet.values()) {
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
    let retrieved = this.storage.retrieve('fleet');
    let fleet: Map<string, Ship> =
      retrieved == undefined ? new Map<string, Ship>() : retrieved.data;
    this.fleet = fleet;
    let atWpt: Ship[] = [];
    for (let ship of fleet.values()) {
      if (ship.nav.waypointSymbol == wptSymbol) {
        atWpt.push(ship);
      }
    }
    this.shipsAtWaypoint = atWpt;
  }

  activateDetailPanel(wptSymbol: string) {
    this.activeWaypoint = wptSymbol;
    if (this.waypoints != undefined) {
      this.activeWaypointDetails = this.waypoints.get(wptSymbol);
    } else {
      this.activeWaypointDetails = undefined;
    }
    this.updateShipsAtWaypoint(wptSymbol);
    console.log(
      '[starpanel::activateDetailPanel] Setting active waypoint:',
      this.activeWaypoint
    );
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
    if (this.waypoints) {
      let retrieved = this.waypoints.get(waypointSymbol);
      if (retrieved) {
        return retrieved;
      }
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
    let res: Waypoint[] = [...this.waypoints.values()].sort((a, b) => {
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
