import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() isRecipesSelected = new EventEmitter<boolean>();
  @Input() isDropdownActive: boolean = false;

  constructor(private dataStorageService: DataStorageService) {}

  onSaveRecipes() {
    this.dataStorageService.storeRecipes();
  }

  onFetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
