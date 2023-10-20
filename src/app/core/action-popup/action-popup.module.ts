import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPopupComponent } from './action-popup.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ActionPopupComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [ActionPopupComponent]
})
export class ActionPopupModule { }
