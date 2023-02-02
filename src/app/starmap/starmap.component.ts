import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { BaseChartDirective } from 'ng2-charts';
//@ts-ignore
import createScatterPlot from 'regl-scatterplot';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { axisBottom, axisRight } from 'd3-axis';
import { select, selectAll } from 'd3-selection';
import { Ship, System, SystemWaypoint } from 'spacetraders-v2-ng';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-starmap',
  templateUrl: './starmap.component.html',
  styleUrls: ['./starmap.component.sass'],
})
export class StarmapComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  selectedSystemSymbol: string | undefined;
  selectedSystemCategory: string | undefined;
  selectedSystemX: number | undefined;
  selectedSystemY: number | undefined;
  selectedSystemWaypoints: SystemWaypoint[] | undefined;

  chartLabels: Array<string> = [];
  coordinateMatrix: number[][] = [];
  scatterplot: any;
  xDomain: [number, number] = [0, 0];
  yDomain: [number, number] = [0, 0];
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  xAxis: any;
  yAxis: any;
  parentContainer: HTMLDivElement;
  canvasWrapper: HTMLDivElement;
  axisContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;
  xAxisPadding = 0;
  yAxisPadding = 0;
  selection: number[] = [];
  width: number = 0;
  height: number = 0;

  systemFavorites: string[] = ['X1-DF55'];
  // systemFavorites: string[] = [];
  categoryMap: Record<number, string> = {
    0: 'Uncategorized',
    1: 'Favorited',
    2: 'Uninitialized',
    3: 'Has Ship',
  };

  selectHandler = (points: { points: number[] }) => {
    let selectedPoints = points.points;
    // console.log('Selected:', selectedPoints);
    this.selection = selectedPoints;
    if (this.selection.length === 1) {
      const point = this.coordinateMatrix[this.selection[0]];
      this.selectedSystemX = this.normalizeCoordinate(point[0], true, true);
      this.selectedSystemY = this.normalizeCoordinate(point[1], false, true);
      this.selectedSystemCategory = this.categoryMap[point[2]];
      this.selectedSystemSymbol = this.chartLabels[point[3]];
      let retrievedSystems = this.storage.retrieve('systems');
      let tempSysStorage: System[] = [...this.systems.values()].filter(
        (sys: System) => sys.symbol == this.selectedSystemSymbol
      );
      if (
        tempSysStorage.length > 0 &&
        tempSysStorage[0].waypoints &&
        tempSysStorage[0].waypoints.length > 0
      ) {
        this.selectedSystemWaypoints = tempSysStorage[0].waypoints;
      }
      // console.log(
      //   `X: ${this.normalizeCoordinate(
      //     point[0],
      //     true,
      //     true
      //   )}\nY: ${this.normalizeCoordinate(point[1], false, true)}\nCategory: ${
      //     point[2]
      //   }\nValue: ${this.chartLabels[point[3]]}
      //   System Waypoints: ${
      //     this.selectedSystemWaypoints
      //       ? this.selectedSystemWaypoints.length
      //       : undefined
      //   }`
      // );
    }
  };

  deselectHandler = () => {
    console.log('Deselected:', this.selection);
    this.selection = [];
  };

  resizeHandler = () => {
    let rect: DOMRect = this.canvasWrapper.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.xAxisContainer
      .attr('transform', `translate(0, ${this.height})`)
      .call(this.xAxis);
    this.yAxisContainer
      .attr('transform', `translate(${this.width}, 0)`)
      .call(this.yAxis);

    // Render grid
    this.xAxis.tickSizeInner(-this.height);
    this.yAxis.tickSizeInner(-this.width);
  };

  ngOnInit() {
    this.parentContainer = document.querySelector('#starmap-container')!;
    this.canvasWrapper = document.querySelector('#starmap-wrapper')!;

    let canvas: HTMLCanvasElement = document.querySelector('#starmap-canvas')!;
    let smRect: DOMRect = canvas.getBoundingClientRect();
    let smWidth: number = smRect.width;
    let smHeight: number = smRect.height;

    this.axisContainer = select(this.parentContainer).append('svg');
    this.axisContainer.attr('style', 'color: #fff');
    this.xAxisContainer = this.axisContainer.append('g').attr('class', 'axis');
    this.yAxisContainer = this.axisContainer.append('g').attr('class', 'axis');
    this.axisContainer.node().style.position = 'absolute';
    this.axisContainer.node().style.top = canvas.offsetTop;
    this.axisContainer.node().style.left = canvas.offsetLeft;
    this.axisContainer.node().style.width = smWidth + 50;
    this.axisContainer.node().style.height = smHeight + 25;
    this.axisContainer.node().style.pointerEvents = 'none';

    this.canvasWrapper.style.right = `${this.yAxisPadding}px`;
    this.canvasWrapper.style.bottom = `${this.xAxisPadding}px`;
    let rect: DOMRect = this.canvasWrapper.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.xAxisContainer
      .attr('transform', `translate(1, ${this.height - 3})`)
      .call(this.xAxis);
    this.yAxisContainer
      .attr('transform', `translate(${this.width + 2}, 1.1)`)
      .call(this.yAxis);

    // Render Grid
    this.xAxis.tickSizeInner(-this.height);
    this.yAxis.tickSizeInner(-this.width);

    selectAll('.tick line').attr('style', 'color: rgba(255, 255, 255, 0.1)');

    let favoriteYellow: string = '#fffb00';
    let uncategorizedLightBlue: string = '#ddeef8';
    let uninitializedRed = '#ff2100';
    let hasShipGreen = '#00ff7a';
    this.scatterplot = createScatterPlot({
      canvas: canvas,
      width: smWidth,
      height: smHeight,
      xScale: this.xScale,
      yScale: this.yScale,
      showReticle: true,
      keyMap: {
        shift: 'rotate',
        alt: 'rotate',
        cmd: 'rotate',
        ctrl: 'rotate',
        meta: 'rotate',
      },
      colorBy: 'category',
      sizeBy: 'category',
      pointColor: [
        uncategorizedLightBlue,
        favoriteYellow,
        uninitializedRed,
        hasShipGreen,
      ],
      pointSize: [2, 5, 3, 5],
      // opacity: 1,
    });

    this.scatterplot.subscribe('select', this.selectHandler);
    this.scatterplot.subscribe('deselect', this.deselectHandler);
    this.scatterplot.subscribe(
      'view',
      (event: { xScale: any; yScale: any }) => {
        this.axisContainer.node().style.top = canvas.offsetTop;
        this.axisContainer.node().style.left = canvas.offsetLeft;
        this.xAxisContainer.call(this.xAxis.scale(event.xScale));
        this.yAxisContainer.call(this.yAxis.scale(event.yScale));
        selectAll('.tick line').attr(
          'style',
          'color: rgba(255, 255, 255, 0.1)'
        );
      }
    );
    this.scatterplot.subscribe(
      'init',
      () => {
        this.xAxisContainer.call(
          this.xAxis.scale(this.scatterplot.get('xScale'))
        );
        this.yAxisContainer.call(
          this.yAxis.scale(this.scatterplot.get('yScale'))
        );
      },
      1
    );

    this.updateSystems();
  }

  constructor(public api: ApiService, public storage: StorageService) {
    let systems: System[] = [...this.systems.values()];
    let sysx = systems.map((s) => s.x);
    let sysy = systems.map((s) => s.y);
    let xmax = Math.max(...sysx);
    let xmin = Math.min(...sysx);
    let ymax = Math.max(...sysy);
    let ymin = Math.min(...sysy);
    console.log('XmaxXminYmaxYmin', xmax, xmin, ymax, ymin);
    this.xDomain = [xmin, xmax];
    this.yDomain = [ymin, ymax];
    this.xScale = scaleLinear().domain(this.xDomain).range([-1, 1]);
    this.yScale = scaleLinear().domain(this.yDomain).range([-1, 1]);
    this.xAxis = axisBottom(this.xScale);
    this.yAxis = axisRight(this.yScale);

    this.parentContainer = document.querySelector('#starmap-container')!;
    this.canvasWrapper = document.querySelector('#starmap-wrapper')!;
  }

  async updateSystems(force = false) {
    console.log(
      '[starmap-component::updateSystems] Received call, checking if needed'
    );
    let retrieved = this.storage.retrieve('systems');
    // If not as many systems as expected, or if data is 1 day stale (86400000 millis) then refresh from server
    if (
      retrieved == undefined ||
      retrieved.data.size == 0 ||
      new Date().getTime() - new Date(retrieved.timestamp).getTime() >=
        86400000 ||
      force
    ) {
      console.log(
        '[starmap-component::updateSystems] Systems are missing or stale, running update'
      );
      await this.api.getAllSystems();
      retrieved = this.storage.retrieve('systems');
    } else {
      console.log(
        '[starmap-component::updateSystems] Skipping update, systems are fresh'
      );
    }
    this.updateSystemChart();
  }

  get systems(): Map<string, System> {
    let retrieved = this.storage.retrieve('systems');
    return retrieved == undefined ? new Map<string, System>() : retrieved.data;
  }

  normalizeCoordinate(
    numIn: number,
    isX: boolean,
    denormalize: boolean
  ): number {
    let res: number;
    if (isX) {
      if (denormalize) {
        // denormalize X
        // res = this.xScale.invert(numIn);
        res = Math.round(
          scaleLinear().domain(this.xDomain).range([-1, 1]).invert(numIn)
        );
      } else {
        // normalize X
        // res = this.xScale(numIn);
        res = scaleLinear().domain(this.xDomain).range([-1, 1])(numIn);
      }
    } else {
      if (denormalize) {
        // denormalize Y
        // res = this.yScale.invert(numIn);
        res = Math.round(
          scaleLinear().domain(this.yDomain).range([-1, 1]).invert(numIn)
        );
      } else {
        // normalize Y
        // res = this.yScale(numIn);
        res = scaleLinear().domain(this.yDomain).range([-1, 1])(numIn);
      }
    }
    return res;
  }

  updateSystemChart() {
    // TODO: CHECK DOES THIS WORK FOR UPDATING THE DATA?
    this.chartLabels = [];
    this.coordinateMatrix = [];
    // let xmax = Math.max(...systems.map((s) => s.y));
    // let xmin = Math.min(...systems.map((s) => s.y));
    // let ymax = Math.max(...systems.map((s) => s.y));
    // let ymin = Math.min(...systems.map((s) => s.y));
    // this.xDomain = [xmin, xmax];
    // this.yDomain = [ymin, ymax];
    // console.log('domains:', this.xDomain, this.yDomain);
    // this.xScale = scaleLinear().domain(this.xDomain);
    // this.yScale = scaleLinear().domain(this.yDomain);
    // this.xAxis = axisBottom(this.xScale);
    // this.yAxis = axisRight(this.yScale);
    let uninitialized = [];
    let retrievedFleet = this.storage.retrieve('fleet');
    let fleet = retrievedFleet ? retrievedFleet.data : new Map<string, Ship>();
    let fleetSystems = new Set();
    for (let ship of fleet.values()) {
      fleetSystems.add(ship.nav.systemSymbol);
    }
    for (let sys of this.systems.values()) {
      this.chartLabels.push(sys.symbol);
      let normx = this.normalizeCoordinate(sys.x, true, false);
      let normy = this.normalizeCoordinate(sys.y, false, false);
      let category = 0;
      // Apply Uninitialized as Category
      if (sys.waypoints.length == 0) {
        category = 2;
        uninitialized.push(sys.symbol);
      }
      // Apply Has Ship as Category
      if (fleetSystems.has(sys.symbol)) {
        category = 3;
      }
      // Apply Favorite as Category
      if (this.systemFavorites.indexOf(sys.symbol) > -1) {
        category = 1;
      }
      this.coordinateMatrix.push([
        normx,
        normy,
        category,
        this.chartLabels.length - 1,
      ]);
    }
    console.log(
      '[starmap-component::updateSystemChart] Uninitialized Systems:',
      uninitialized
    );
    this.scatterplot.draw(this.coordinateMatrix);
  }
}
