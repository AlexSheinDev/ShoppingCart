import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() isRecipesSelected = new EventEmitter<boolean>();
  @Input() isDropdownActive: boolean = false;

  onRecipesSelect(value: boolean) {
    this.isRecipesSelected.emit(value);
  }
}
