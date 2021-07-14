import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.sass'],
})
export class BadgeComponent implements OnInit {
  //[iconSrc]="" [badgeText]=""

  @Input() iconSrc: string;
  @Input() badgeText: string;
  @Input() badgeStyle: any;
  @Input() badgeTooltip: string;

  constructor() {}

  ngOnInit(): void {}
}
