
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import Script from '../../models/Script';
import { Experience } from '../../models/Experience';
import { ConfirmationWindowService } from '../../services/confirmation-window.service';
import { ExitRequestService } from '../../services/exit-request.service';
import { filter, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-file-reader',
  imports: [NgStyle, NgFor, NgIf],
  templateUrl: './file-reader.component.html',
  styleUrl: './file-reader.component.scss'
})
export class FileReaderComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() id!: string;
  @Input() experience !: Experience;
  @Input() script !: Script | undefined;

  private sub !:Subscription;
  private destroy$ = new Subject<void>();

  constructor(private el : ElementRef, private confirmationWindowService : ConfirmationWindowService, private exitRequestService : ExitRequestService) {}

  ngOnInit(): void {
    this.sub = this.exitRequestService.exitRequested$.pipe(
      filter(event => event.windowId === this.id)
    )
    .subscribe(async event => {
      const title = this.el.nativeElement.querySelector('.title');
      const description = this.el.nativeElement.querySelector('.description');
      if(title.innerText !== this.experience.header || description.innerText !== this.experience.body) {
        const answer = await this.confirmationWindowService.ask("You have unsaved changes, you want to saving them before closing?");
        if(answer) {
          this.experience.header = title.innerText;
          this.experience.body = description.innerText;
        }
        event.callback();
      } else {
        event.callback();
      }
    })
  }

  ngAfterViewInit(): void {
    if(this.experience) {
      const desc = this.el.nativeElement.querySelector(".description");
      requestAnimationFrame(() => desc.focus());
      requestAnimationFrame(() => this.placeCaretAtEnd(desc));
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  preventNewLine(event : KeyboardEvent) {
    if(event.key === 'Enter') {
      event.preventDefault();
    }
  }

  onInput(event : Event) {
    const el = event.target as HTMLElement;
    if(el.innerHTML === '<br>' || el.innerHTML === '<br/>' || el.innerHTML === '<div><br></div>' || el.innerHTML === '<div></div>') {
      el.innerHTML = '';
    }
  }

  placeCaretAtEnd(el : HTMLElement) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false);

    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  boldEffect() {
    this.experience.isBold = !this.experience.isBold;
  }

  italicEffect() {
    this.experience.isItalic = !this.experience.isItalic;
  }

  underlineEffect() {
    this.experience.isUnderlined = !this.experience.isUnderlined;
  }
}
