import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { ApiService } from '../api.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-net-worth-chart',
  templateUrl: './net-worth-chart.component.html',
  styleUrls: ['./net-worth-chart.component.sass'],
})
export class NetWorthChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  lastChartUpdate = this.st.lastUpdated;
  timeTillNext = 300000;
  DEBUG = false;

  public lineChartData: ChartDataSets[] = [{ data: [], label: 'Net Worth', spanGaps: false }];
  public lineChartLabels: string[] = [];
  public lineChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          gridLines: { color: '#c7c7c7' },
          ticks: {
            fontColor: '#ffffff',
          },
        },
      ],
      yAxes: [
        {
          gridLines: { color: '#c7c7c7' },
          ticks: {
            fontColor: '#ffffff',
          },
        },
      ],
    },
    legend: {
      labels: {
        fontColor: 'white',
      },
    },
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgb(241, 245, 20)',
      backgroundColor: 'rgba(241, 245, 20,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(public st: ApiService) {}

  ngOnInit(): void {
    this.updateChart(true);
    setTimeout(this.startUpdateLoop.bind(this), 1000);
  }

  startUpdateLoop() {
    let seconds = new Date().getSeconds();
    if (seconds == 0) {
      setInterval(this.updateChart.bind(this), 20000);
    } else {
      setTimeout(this.startUpdateLoop.bind(this), 1000);
    }
  }

  updateChart(force?: boolean): void {
    let maxEntries = 48;
    this.timeTillNext = Math.floor((300000 - (Date.now() - this.lastChartUpdate)) / 1000);
    if (this.chart) {
      if (force || Date.now() - this.lastChartUpdate >= 60000) {
        this.DEBUG && console.log('[net-worth-chart] interval time reached, updating chart');
        let nwHist = this.st.retrieveLocally('netWorthHistory');
        if (nwHist) {
          this.DEBUG && console.log('[net-worth-chart] nwHist received', nwHist);
          this.lineChartData[0].data = nwHist.values.slice(-maxEntries);
          nwHist.timestamps = nwHist.timestamps.slice(-maxEntries);
          nwHist.timestamps = nwHist.timestamps.map((str) => {
            let stamp = new Date(str);
            let diff = stamp.valueOf() - Date.now();
            diff = Math.floor(diff / 1000 / 60);
            return (
              stamp.getHours().toString().padStart(2, '0') +
              ':' +
              stamp.getMinutes().toString().padStart(2, '0') +
              ':' +
              stamp.getSeconds().toString().padStart(2, '0') +
              ' (' +
              (diff <= -60 ? Math.floor(diff / 60) + 1 + 'h' + (diff % 60) + 'm' : diff + 'm') +
              ')'
            );
          });
          this.lineChartLabels = nwHist.timestamps;
        } else {
          this.DEBUG && console.log('[net-worth-chart] nwHist missing, retrying in 60s');
        }
        this.chart.chart.update();
      } else {
        this.DEBUG &&
          console.log('[net-worth-chart] chart exists but interval time not reached, elapsed:', Date.now() - this.lastChartUpdate >= 60000);
      }
    } else {
      this.DEBUG && console.log('[net-worth-chart] chart missing, retrying in 1s');
      setTimeout(
        function () {
          this.updateChart(force);
        }.bind(this),
        1000
      );
    }
  }
}
