<script lang="ts">
  import { login } from '../lib/auth';
  import { navigate } from '../lib/router';

  let password = $state('');
  let error = $state(false);
  let shake = $state(false);

  function handleLogin() {
    if (login(password)) {
      navigate('/admin/kitchen-sink');
    } else {
      error = true;
      shake = true;
      setTimeout(() => (shake = false), 500);
    }
  }

  function onFormSubmit(e: Event) {
    e.preventDefault();
    handleLogin();
  }
</script>

<lib-background variant="ash-grid">
  <div class="login-wrapper">
    <div class="card-wrapper" class:is-shaking={shake}>
      <lib-glass-card variant="warm" intensity="high">
        <form class="login-form" onsubmit={onFormSubmit}>

          <div class="brand">
            <span class="kanji">渋</span>
            <span class="access-message">admin · acceso restringido</span>
          </div>

          <lib-input
            type="password"
            label="Contraseña"
            placeholder="••••••••••"
            value={password}
            error={error}
            errorMessage="Contraseña incorrecta"
            onui-lib-input={(e: Event) => { password = (e as CustomEvent).detail.value; error = false; }}
          ></lib-input>

          <lib-button variant="primary" onui-lib-click={handleLogin}>
            Entrar
          </lib-button>

        </form>
      </lib-glass-card>
    </div>
  </div>
</lib-background>

<style>
  .login-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .card-wrapper {
    width: 100%;
    max-width: 380px;
  }

  .card-wrapper.is-shaking {
    animation: shake 0.4s ease;
  }

  .login-form {
    padding: var(--lib-space-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-xl);
  }

  .brand {
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-xs);
  }

  .kanji {
    font-family: var(--lib-font-display);
    font-size: var(--text-3xl);
    font-weight: var(--weight-light);
    color: color-mix(in oklch, var(--color-kaki-500), transparent 40%);
    line-height: 1;
  }

  .access-message {
    font-family: var(--lib-font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--text-muted);
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
</style>
