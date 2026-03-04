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
// DIFERENÇA — SUBSTITUINDO $EMIT POR ACTION DA STORE
// ---------------------------------------------------------------
// ANTES (local state + emit):
//   modoEscuroAtivo vivia no data() deste componente.
//   Para avisar o App.vue da mudança, era preciso emitir um evento:
//
//   data() { return { modoEscuroAtivo: false } }
//
//   methods: {
//     alterarTema() {
//       this.modoEscuroAtivo = !this.modoEscuroAtivo
//       this.$emit('aoTemaAlterado', this.modoEscuroAtivo)  // ← avisa o pai
//     }
//   }
//
//   E o App.vue precisava escutar:
//   <BarraLateral @aoTemaAlterado="trocarTema" />
//
// COM PINIA:
//   modoEscuroAtivo vive na store, não mais aqui.
//   Chamamos store.trocarTema() e todos os componentes que leem
//   esse estado da store (como App.vue) atualizam automaticamente.
//   Sem $emit, sem escutar evento no pai.
// ---------------------------------------------------------------
export default defineComponent({
  name: 'BarraLateral',
  // 'emits' foi removido — não precisamos mais emitir eventos para o pai
  setup() {
    const store = useTarefasStore()

    // ANTES: textoBotao era um computed local que lia this.modoEscuroAtivo do data().
    // AGORA: lê store.modoEscuroAtivo — o mesmo valor que o App.vue usa para
    // aplicar o tema, garantindo consistência sem precisar de props ou eventos.
    const textoBotao = computed(() =>
      store.modoEscuroAtivo ? 'Desativar modo escuro' : 'Ativar modo escuro'
    )

    // ANTES: alterarTema() alternava this.modoEscuroAtivo local e emitia
    // $emit('aoTemaAlterado', valor) para o App.vue tratar.
    // AGORA: chama store.trocarTema() — a store atualiza e todos os
    // componentes que leem esse estado reagem automaticamente.
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
