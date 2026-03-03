<template>
  <div class="box has-text-weight-bold app-box">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppBox'
})
</script>

<style scoped>
.app-box {
  background-color: var(--bg-box);
  color: var(--texto-primario);
  border: 1px solid var(--borda-box);
  border-left: 4px solid var(--botao-primario);
  box-shadow: none;
}
</style>
