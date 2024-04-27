import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({opacity: 0}), animate('600ms 300ms', style({opacity: 1}))]),
      transition(':leave', [animate('100ms 300ms', style({opacity: 0}))]),
    ]),
  ],
})
export class MenuItemComponent {
  @Input() imgSrc: string | undefined;
  @Input() imgSrcActive?: string;
  @Input() imgSrcUnactive?: string;
  @Input() imgAlt: string | undefined;
  @Input() spanText: string | undefined;
  @Input() isExpanded = true;
  @Output() isExpandedChange = new EventEmitter<boolean>();
  @Input() menuItems: Array<{name: string; path: string}> | undefined;
  @Input() routerPath!: string;
  @Input() disabled: boolean = false;

  finalImgSrc: string | undefined;

  tooltipIsVisible = false;
  dropdownIsVisible: boolean = false;

  constructor(private router: Router) {}

  get active() {
    if (this.menuItems) {
      let allActive = this.isActive(this.routerPath);
      for (const menuItem of this.menuItems) {
        allActive = allActive || this.isActiveItem(menuItem.path);
      }
      return allActive;
    } else if (this.routerPath) {
      return this.isActive(this.routerPath);
    } else {
      return false;
    }
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  isActiveItem(path: string): boolean {
    const currPath = this.router.url;
    const indexRouterPath = currPath.indexOf(this.routerPath);
    if (indexRouterPath === -1) {
      return currPath.includes(path);
    }
    const query = currPath.indexOf('?');

    let currPathWithoutQuery = currPath;
    if (query !== -1) {
      currPathWithoutQuery = currPath.slice(0, query);
    }

    if (this.routerPath === path) {
      return currPathWithoutQuery === path;
    }

    const currPathWithoutRoot = currPathWithoutQuery.replace(this.routerPath, '');
    const pathWithoutRoot = path.replace(this.routerPath, '');

    return currPathWithoutRoot.includes(pathWithoutRoot);
  }

  handleClick(): void {
    if (this.menuItems && this.isExpanded) {
      this.toggleDropdown();
    } else if (this.menuItems) {
      this.isExpandedChange.emit(true);
      this.toggleDropdown();
    } else {
      this.navigate(this.routerPath);
    }
  }

  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }

  showTooltip(): void {
    this.tooltipIsVisible = true;
  }

  hideTooltip(): void {
    this.tooltipIsVisible = false;
  }

  toggleDropdown(): void {
    this.dropdownIsVisible = !this.dropdownIsVisible;
  }

  navigate(path: string | undefined): void {
    this.router.navigate([path]);
  }
}

//
