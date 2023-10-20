import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { MaterialExModule } from 'src/app/shared/material.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { permission } from 'src/app/shared/permission';
import { LoaderModule } from 'src/app/core/loader/loader.module';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: { title: 'Profile', permission: permission.myProfile }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { title: 'Change Password', permission: permission.changePassword }
  },
  {
    path: 'edit',
    component: EditProfileComponent,
    data: { title: 'Update Profile', permission: permission.myProfile }
  }
]

@NgModule({
  declarations: [ProfileComponent, ChangePasswordComponent, EditProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormValidationModule,
    SharedModule,
    RouterModule.forChild(routes),
    MaterialExModule,
    MatInputModule,
    MatButtonModule,
    LoaderModule
  ], providers: [
    AuthService
  ]
})
export class ProfileModule { }
