<template>
  <!-- utilizando a diretiva v-bind para aplicar uma classe condicionalmente -->
  <main class="columns is-gapless is-multiline" :class="{ 'modo-escuro': modoEscuroAtivo }">
    <div class="column is-one-quarter">
      <!-- escutando o método para alterar o tema-->
      <BarraLateral @aoTemaAlterado="trocarTema"/>
    </div>
    <div class="column is-three-quarter conteudo">
      <Formulario @aoSalvarTarefa="salvarTarefa"/>
      <div class="lista">
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
import BarraLateral from './components/BarraLateral.vue'
import Formulario from './components/Formulario.vue'
import Tarefa from './components/Tarefa.vue'
import Box from './components/Box.vue'
import ITarefa from './interfaces/ITarefa'

export default defineComponent({
  name: 'App',
  components: {
    BarraLateral,
    Formulario,
    Tarefa,
    Box
  },
  data () {
    return {
      tarefas: [] as ITarefa[],
      modoEscuroAtivo: false
    }
  },
  computed: {
    listaEstaVazia () : boolean {
      return this.tarefas.length === 0
    }
  },
  methods: {
    salvarTarefa (tarefa: ITarefa) {
      this.tarefas.push(tarefa)
    },
    // funcao para alterar o tema, recebendo o valor do tema do componente barra lateral
    trocarTema (modoEscuroAtivo: boolean) {
      this.modoEscuroAtivo = modoEscuroAtivo
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
