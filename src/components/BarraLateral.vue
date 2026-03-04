<template>
  <header>
      <h1>
        <img src="../assets/logo.png" alt="">  
      </h1>
      <button class="button" @click="alterarTema">
        {{ textoBotao }}
      </button>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useTarefasStore } from '../stores/tarefas'

// ---------------------------------------------------------------
// DIFERENÇA — SUBSTITUINDO EMIT POR ACESSO DIRETO À STORE
// ---------------------------------------------------------------
// ANTES (sem store):
//   O componente guardava modoEscuroAtivo localmente e emitia
//   @aoTemaAlterado para que o App.vue tratasse a mudança.
//   Isso exigia prop-drilling / event bubbling entre componentes.
//
// COM PINIA:
//   O componente acessa a store diretamente e chama a action
//   trocarTema(). O App.vue reage automaticamente porque lê
//   o mesmo estado reativo da store via storeToRefs.
//   Resultado: menos acoplamento, sem eventos intermediários.
// ---------------------------------------------------------------
//
// NOTA SOBRE COMPOSITION API vs OPTIONS API:
//   Pinia se integra mais naturalmente com a Composition API pura.
//   Misturar setup() com computed/methods do Options API funciona,
//   mas é mais propenso a erros. Prefira usar toda a lógica dentro
//   de setup() para evitar inconsistências de contexto (this).
// ---------------------------------------------------------------
export default defineComponent({
  name: 'BarraLateral',
  // 'emits' foi removido — não precisamos mais emitir eventos para o pai
  setup() {
    const store = useTarefasStore()

    // computed dentro de setup() para evitar dependência de 'this'
    // Em Vuex seria: computed: { ...mapState(['modoEscuroAtivo']) }
    // Em Pinia: usamos computed() diretamente com acesso ao store reativo
    const textoBotao = computed(() =>
      store.modoEscuroAtivo ? 'Desativar modo escuro' : 'Ativar modo escuro'
    )

    // Função que chama a action diretamente — sem this.$emit()
    // Em Vuex seria: this.$store.dispatch('trocarTema')
    // Em Pinia: store.trocarTema() — chamada direta, sem dispatch()
    function alterarTema() {
      store.trocarTema()
    }

    return {
      textoBotao,
      alterarTema
    }
  }
})
</script>

<style scoped>
header {
  padding: 1rem;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-borda);
  width: 100%;
  height: 100vh;
  text-align: center;
}

.button {
  background-color: var(--botao-primario);
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-weight: 700;
}

.button:hover {
  background-color: var(--botao-primario-hover);
  color: #fff;
}

@media only screen and (max-width: 768px) {
  header {
    padding: 2.5rem;
    height: auto;
  }
}
</style>
