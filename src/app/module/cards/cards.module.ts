import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { AddCardsComponent } from './add-cards/add-cards.component';
import { CardsListComponent } from './cards-list/cards-list.component';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';
import { EditCardsComponent } from './edit-cards/edit-cards.component';
import { LoaderModule } from 'src/app/core/loader/loader.module';

const routes: Routes = [
  {
    path: "",
    component: CardsListComponent,
    data: { title: 'Cards List', permission: permission.cardList }
  },
  {
    path: "add",
    component: AddCardsComponent,
    data: { title: 'Add card', permission: permission.addCard }
  },
  {
    path: 'edit/:id',
    component: EditCardsComponent,
    data: { title: 'Update card', permission: permission.updateCard }
  }
]

@NgModule({
  declarations: [CardsListComponent, AddCardsComponent, EditCardsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    PaginationModule,
    SearchModule,
    LoaderModule
  ]
})
export class CardsModule { }
