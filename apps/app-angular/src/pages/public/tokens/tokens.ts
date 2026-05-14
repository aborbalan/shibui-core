import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TokensService } from '@data/services/tokens.service';
import { DesignTokenDto } from '@data/models/tokens.models';
import { TokensSidebarComponent } from '@components/tokens/tokens-sidebar/tokens-sidebar';
import { TokenSectionComponent } from '@components/tokens/token-section/token-section';

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [TokensSidebarComponent, TokenSectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tokens.html',
  styleUrl: './tokens.scss',
})
export class Tokens {
  private svc = inject(TokensService);
  readonly allTokens = toSignal(this.svc.getAll(), { initialValue: [] as DesignTokenDto[] });

  readonly colorTokens = computed(() =>
    this.allTokens().filter((t) => t.category.startsWith('color'))
  );
  readonly typographyTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'typography')
  );
  readonly spacingTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'spacing')
  );
  readonly radiusTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'radius')
  );
  readonly shadowTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'shadow')
  );
  readonly animationTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'animation')
  );
  readonly zIndexTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'z-index')
  );
  readonly glassTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'glass')
  );
  readonly spotlightTokens = computed(() =>
    this.allTokens().filter((t) => t.category === 'spotlight')
  );
}
