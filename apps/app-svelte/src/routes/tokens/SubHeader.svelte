<script lang="ts">
  interface Props { label: string; first?: boolean }
  let { label, first = false }: Props = $props();
</script>

<lib-divider
  tone="accent"
  label-style="mono"
  align="left"
  style="margin-bottom:0.75rem;margin-top:{first ? '0' : '2rem'};"
>
  {label}
</lib-divider>
