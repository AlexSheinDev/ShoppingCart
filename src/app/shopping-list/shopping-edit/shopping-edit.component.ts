import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './../store/shopping-list.actions';
import * as fromShoppingList from './../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  isEditMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.isEditMode = true;
          this.editedItem = stateData.editedIngredient;
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.isEditMode = false;
        }
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.isEditMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    this.resetForm();
  }

  resetForm() {
    this.slForm.reset();
    this.isEditMode = false;
    this.editedItem = null;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
