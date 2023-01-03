import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { BaseChartDirective } from 'ng2-charts';
//@ts-ignore
import createScatterPlot from 'regl-scatterplot';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { axisBottom, axisRight } from 'd3-axis';
import { select } from 'd3-selection';

@Component({
  selector: 'app-starmap',
  templateUrl: './starmap.component.html',
  styleUrls: ['./starmap.component.sass'],
})
export class StarmapComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

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

  selectHandler = (points: { points: number[] }) => {
    let selectedPoints = points.points;
    console.log('Selected:', selectedPoints);
    this.selection = selectedPoints;
    if (this.selection.length === 1) {
      const point = this.coordinateMatrix[this.selection[0]];
      console.log(
        `X: ${this.normalizeCoordinate(
          point[0],
          true,
          true
        )}\nY: ${this.normalizeCoordinate(point[1], false, true)}\nCategory: ${
          point[2]
        }\nValue: ${this.chartLabels[point[3]]}`
      );
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
    this.xAxisContainer = this.axisContainer.append('g');
    this.yAxisContainer = this.axisContainer.append('g');
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

    let mainYellow: string = '#fffb00';
    let mainWhite: string = '#ffffff';
    let labelBlue: string = '#82cefa';
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
      pointColor: [mainYellow, mainWhite],
      // opacity: 1,
      pointSize: 3,
    });

    this.scatterplot.subscribe('select', this.selectHandler);
    this.scatterplot.subscribe('deselect', this.deselectHandler);
    this.scatterplot.subscribe(
      'view',
      (event: { xScale: any; yScale: any }) => {
        this.xAxisContainer.call(this.xAxis.scale(event.xScale));
        this.yAxisContainer.call(this.yAxis.scale(event.yScale));
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

    this.initializeCharts();
  }

  constructor(public api: ApiService) {
    let systems: System[] = this.systems;
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

  async initializeCharts() {
    await this.api.getAllSystems();
    this.updateSystemChart();
  }

  get systems(): Array<System> {
    return this.api.retrieveLocally('systems').systems;
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
    this.chartLabels = [];
    this.coordinateMatrix = [];
    let systems: System[] = this.systems;
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
    for (let sys of systems) {
      this.chartLabels.push(sys.symbol);
      let normx = this.normalizeCoordinate(sys.x, true, false);
      let normy = this.normalizeCoordinate(sys.y, false, false);
      this.coordinateMatrix.push([
        normx,
        normy,
        0,
        this.chartLabels.length - 1,
      ]);
    }
    this.scatterplot.draw(this.coordinateMatrix);
  }
}

interface System {
  factions: string[];
  sectorSymbol: string;
  symbol: string;
  type: string;
  waypoints: SystemWaypoint[];
  x: number;
  y: number;
}

interface SystemWaypoint {
  symbol: string;
  type: string;
  x: number;
  y: number;
}
