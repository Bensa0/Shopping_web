import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[xsFaIcon]',
  standalone: true,
})
export class FaIconDirective {
  @Input()
  icon!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'fas');
    this.renderer.addClass(this.el.nativeElement, `${this.icon}`);
  }
}
