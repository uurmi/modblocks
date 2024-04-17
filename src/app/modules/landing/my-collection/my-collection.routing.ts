import { Route } from '@angular/router';
import { MyCollectionComponent } from 'app/modules/landing/my-collection/my-collection.component';

export const myCollectionRoutes: Route[] = [
    {
        path     : '',
        component: MyCollectionComponent
    }
];
