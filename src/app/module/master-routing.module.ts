import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterLayoutComponent } from '../core/layout/sidebar/master-layout.component';
import { permission } from '../shared/permission';

const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'tenant-profile',
        loadChildren: () => import('./tenant-profile/tenant-profile.module').then(m => m.TenantProfileModule),
      },
      {
        path: 'bu-profile',
        loadChildren: () => import('./business-unit-profile/business-unit-profile.module').then(m => m.BusinessUnitProfileModule),
      },

      // Module
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
      },
      {
        path: 'tenant',
        loadChildren: () => import('./tenant/tenant.module').then(m => m.TenantModule),
      },
      {
        path: 'business-unit',
        loadChildren: () => import('./business-unit/business-unit.module').then(m => m.BusinessUnitModule),
      },
      {
        path: 'cards',
        loadChildren: () => import('./cards/cards.module').then(m => m.CardsModule),
      },
      {
        path: 'my-cards',
        loadChildren: () => import('./mycards/mycards.module').then(m => m.MycardsModule),
      },
      {
        path: 'address',
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'distributor',
        loadChildren: () => import('./distributor/distributor.module').then(m => m.DistributorModule),
      },
      {
        path: 'reseller',
        loadChildren: () => import('./reseller/reseller.module').then(m => m.resellerModule),
      },
      {
        path: 'connects',
        loadChildren: () => import('./connects/connects.module').then(m => m.ConnectsModule),
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
        data: { title: 'Report' }
      },
      {
        path: 'approval',
        loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule),
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
