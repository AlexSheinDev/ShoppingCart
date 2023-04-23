import {Directive, ElementRef, HostBinding, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {
  }

  @HostBinding('class.show') isOpen = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    const dropdownMenu = this.elRef.nativeElement.querySelector('.dropdown-menu');

    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;

    if (this.isOpen) {
      this.renderer.addClass(dropdownMenu, 'show');
    } else {
      this.renderer.removeClass(dropdownMenu, 'show');
    }
  }
}
