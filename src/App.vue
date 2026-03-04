<template>
  <!--
    DIFERENÇA — SEM EVENTOS ENTRE COMPONENTES
    ---------------------------------------------------------------
    ANTES (sem store):
      BarraLateral emitia @aoTemaAlterado e Formulario emitia @aoSalvarTarefa.
      App.vue precisava capturar esses eventos e passar dados entre componentes.

    COM PINIA:
      Cada componente acessa a store diretamente para ler e alterar o estado.
      App.vue só precisa LER o estado da store — sem ouvir eventos,
      sem métodos de bridge, sem prop-drilling.
    ---------------------------------------------------------------
  -->

  <!-- utilizando a diretiva v-bind para aplicar uma classe condicionalmente -->
  <!-- modoEscuroAtivo agora vem diretamente da store via storeToRefs -->
  <main class="columns is-gapless is-multiline" :class="{ 'modo-escuro': modoEscuroAtivo }">
    <div class="column is-one-quarter">
      <!-- BarraLateral não precisa mais emitir eventos — altera a store diretamente -->
      <BarraLateral />
    </div>
    <div class="column is-three-quarter conteudo">
      <!-- Formulario não precisa mais emitir eventos — salva na store diretamente -->
      <Formulario />
      <div class="lista">
        <!-- tarefas vem diretamente da store via storeToRefs -->
        <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa"/>
        <Box v-if="listaEstaVazia">
          Nenhuma tarefa iniciada, que tal começar uma agora? :)
        </Box>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import BarraLateral from './components/BarraLateral.vue'
import Formulario from './components/Formulario.vue'
import Tarefa from './components/Tarefa.vue'
import Box from './components/Box.vue'
import { useTarefasStore } from './stores/tarefas'

// ---------------------------------------------------------------
// DIFERENÇA — COMO USAR NO Options API vs Composition API
// ---------------------------------------------------------------
// VUEX com Options API:
//   computed: { ...mapState(['tarefas']), ...mapGetters(['listaEstaVazia']) }
//   methods: { ...mapActions(['salvarTarefa']) }
//
// PINIA com Options API:
//   setup() retorna os dados da store reativos.
//   storeToRefs() converte state e getters em refs reativas para
//   desestruturação segura — sem perder a reatividade.
//   Actions são funções normais e não precisam de storeToRefs.
// ---------------------------------------------------------------
export default defineComponent({
  name: 'App',
  components: {
    BarraLateral,
    Formulario,
    Tarefa,
    Box
  },
  setup() {
    const store = useTarefasStore()

    // storeToRefs garante que tarefas, modoEscuroAtivo e listaEstaVazia
    // sejam refs reativas mesmo após desestruturação.
    // Sem storeToRefs, a desestruturação quebraria a reatividade:
    //   const { tarefas } = store  ← NÃO reativo! (perde reatividade)
    //   const { tarefas } = storeToRefs(store)  ← reativo ✓
    //
    // storeToRefs NÃO deve ser usado para actions (funções),
    // só para state e getters. Actions podem ser acessadas direto: store.acao()
    const { tarefas, modoEscuroAtivo, listaEstaVazia } = storeToRefs(store)

    // Retorna as refs para o template — sem precisar de data() ou computed
    // Em Vuex seria: computed: { ...mapState(['tarefas']), ...mapGetters(['listaEstaVazia']) }
    return {
      tarefas,
      modoEscuroAtivo,
      listaEstaVazia
    }
  }
});
</script>

<style>
.lista {
  padding: 1.25rem;
}

/* Modo claro - estilo Twitter */
main {
  --bg-primario: #ffffff;
  --bg-box: #ffffff;
  --bg-box-alt: #f7f9f9;
  --borda-box: #eff3f4;
  --texto-primario: #0f1419;
  --texto-secundario: #536471;
  --sidebar-bg: #ffffff;
  --sidebar-borda: #eff3f4;
  --botao-primario: #1d9bf0;
  --botao-primario-hover: #1a8cd8;
  --botao-secundario: #e7e7e7;
  --botao-secundario-texto: #0f1419;
  background-color: var(--bg-primario);
  min-height: 100vh;
}

/* Modo escuro - azul escuro quase preto */
main.modo-escuro {
  --bg-primario: #090f1a;
  --bg-box: #162133;
  --bg-box-alt: #1b2b43;
  --borda-box: #2f4f75;
  --texto-primario: #e7efff;
  --texto-secundario: #aac2e6;
  --sidebar-bg: #0b1422;
  --sidebar-borda: #1e3354;
  --botao-primario: #3f7ad1;
  --botao-primario-hover: #5a91df;
  --botao-secundario: #223754;
  --botao-secundario-texto: #e7efff;
}

.conteudo {
  background-color: var(--bg-primario);
  min-height: 100vh;
}
</style>
