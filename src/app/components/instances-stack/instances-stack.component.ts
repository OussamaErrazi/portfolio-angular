import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor } from '@angular/common';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  selector: 'app-instances-stack',
  imports: [NgFor],
  templateUrl: './instances-stack.component.html',
  styleUrl: './instances-stack.component.scss'
})
export class InstancesStackComponent {
  @Input() stack !:OpenInstance[];
  @Input() stackId !:string;
  @Input() removeStackElement !: (i: string, j: string)=> void;
  @Input() putInstanceFront !: (key : string, itemId : string) => void;
  @Input() focusOnWindow !: (key : string, itemId : string) => void;
  @Input() removeFocusOnWindow !: (key : string, itemId : string) => void;
  @Input() hideRevealItem !: (key : string, itemId : string) => void;
  expand = false;

  constructor(private contextmenuService : ContextMenuService) {}

  hoverStart() {
    this.expand = true;
  }

  hoverEnd() {
    this.expand = false;
  }

  hideReveal(itemId : string) {
    this.hoverEnd();
    this.hideRevealItem(this.stackId, itemId);
  }

  close(itemId : string) {
    this.hoverEnd();
    this.onMouseLeaveInstance(itemId);
    this.removeStackElement(this.stackId, itemId);
  }

  putFront(itemId : string) {
    this.hoverEnd();
    this.putInstanceFront(this.stackId, itemId);
    this.removeFocusOnWindow(this.stackId, itemId);
  }

  onMouseEnterInstance(itemId : string) {
    this.focusOnWindow(this.stackId, itemId);
  }

  onMouseLeaveInstance(itemId : string) {
    this.removeFocusOnWindow(this.stackId, itemId);
  }
  
  onRightClick(event : MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextmenuService.open(event.clientX, event.clientY, [{label : 'close all', icon : './delete.png', action : this.closeAll, disabled : false}]);
  }

  closeAll = () => {
  let stackIdClone : string[] = [];
  this.stack.forEach(s => stackIdClone.push(s.id));

  stackIdClone.forEach(id => {
    this.removeStackElement(this.stackId, id);
  })
  }
}
