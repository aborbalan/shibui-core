import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ComponentsService } from '@data/services/components.service';
import { ComponentDetailViewComponent } from '@components/componentes/component-detail-view/component-detail-view';

@Component({
  selector: 'app-componentes-detail',
  standalone: true,
  imports: [ComponentDetailViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './componentes-detail.html',
  styleUrl: './componentes-detail.scss',
})
export class ComponentesDetail {
  private route = inject(ActivatedRoute);
  private svc = inject(ComponentsService);
  private router = inject(Router);

  readonly component = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => this.svc.getBySlug(params.get('slug')!))
    )
  );

  goBack(): void {
    this.router.navigate(['/componentes']);
  }
}
