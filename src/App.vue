<template>
  <!--
    DIFERENÇA — APP.VUE ANTES ERA O "GERENCIADOR MANUAL" DE ESTADO
    ---------------------------------------------------------------
    ANTES (local state + emit):
      App.vue era o centro de tudo: guardava tarefas[] e modoEscuroAtivo
      no seu próprio data(), e ouvia eventos dos filhos para atualizá-los:

      <BarraLateral @aoTemaAlterado="trocarTema" />
      <Formulario   @aoSalvarTarefa="salvarTarefa" />

      methods: {
        trocarTema(val)   { this.modoEscuroAtivo = val },
        salvarTarefa(t)   { this.tarefas.push(t) }
      }

      Todo novo componente que precisasse desses dados dependia de
      App.vue como intermediário — acoplamento alto.

    COM PINIA:
      App.vue só LEIA o estado da store. Os filhos alteram a store
      diretamente. App.vue não precisa ouvir nenhum evento nem ter
      métodos de bridge — apenas reflete o que está na store.
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
// DIFERENÇA — COMO APP.VUE ACESSAVA O ESTADO
// ---------------------------------------------------------------
// ANTES (local state + emit):
//   O estado era declarado diretamente no data() do App.vue.
//   Computed derivavam desse data local. Não havia store:
//
//   data()    { return { tarefas: [], modoEscuroAtivo: false } }
//   computed: { listaEstaVazia() { return this.tarefas.length === 0 } }
//
// COM PINIA:
//   O estado vem da store. Usamos setup() + storeToRefs() para
//   expor o estado ao template de forma reativa.
//   storeToRefs() converte state/getters em refs reativas para que
//   a desestruturação não quebre a reatividade:
//     const { tarefas } = store             ← NÃO reativo!
//     const { tarefas } = storeToRefs(store) ← reativo ✓
//   Actions não precisam de storeToRefs (são funções, não estado).
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

    // storeToRefs converte state e getters da store em refs reativas.
    // Necessário ao desestruturar — sem ele, os valores perdem reatividade:
    //   const { tarefas } = store              ← valor estático, não atualiza!
    //   const { tarefas } = storeToRefs(store) ← ref reativa, atualiza ✓
    //
    // storeToRefs NÃO deve ser usado para actions (são funções, não estado).
    const { tarefas, modoEscuroAtivo, listaEstaVazia } = storeToRefs(store)

    // ANTES: esses valores viviam no data() do App.vue e eram atualizados
    // por métodos locais que ouviam $emit dos filhos.
    // AGORA: vêm da store — App.vue só lê, os filhos alteram diretamente.
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
