<template>
  <div class="box formulario">
    <div class="columns">
      <div
        class="column is-8"
        role="form"
        aria-label="Formulário para criação de uma nova tarefa"
      >
      <!--v-model vai ser responsavel por linkar o status com o input da tarefa-->
        <input
          type="text"
          class="input"
          placeholder="Qual tarefa você deseja iniciar?"
          v-model="descricao"
        />
      </div>
      <div class="column">
        <Temporizador @aoTemporizadorFinalizado="finalizarTarefa"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTarefasStore } from '../stores/tarefas'
import Temporizador from './Temporizador.vue'

// ---------------------------------------------------------------
// DIFERENÇA — SUBSTITUINDO EMIT POR ACTION DA STORE
// ---------------------------------------------------------------
// ANTES (sem store):
//   Formulario emitia @aoSalvarTarefa com os dados da tarefa.
//   App.vue ouvia esse evento e chamava salvarTarefa() localmente.
//   Cada componente pai precisava saber da existência desse evento.
//
// COM PINIA:
//   Formulario chama store.salvarTarefa() diretamente.
//   Nenhum componente pai precisa lidar com o evento.
//   Isso elimina o acoplamento entre Formulario e App.
// ---------------------------------------------------------------
export default defineComponent({
  name: "TarefaFormulario",
  // 'emits' foi removido — a store substitui a necessidade de eventos
  components: {
    Temporizador
  },
  // ---------------------------------------------------------------
  // NOTA: usar setup() para instanciar a store é a prática recomendada.
  // Chamar useTarefasStore() dentro de um method() também funciona no
  // Pinia 2, mas instanciar na setup() e retornar ao componente é
  // mais limpo, consistente e alinhado com a Composition API.
  // ---------------------------------------------------------------
  setup() {
    const store = useTarefasStore()

    // Expõe store para o componente para que methods possam acessar via this.store
    return { store }
  },
  data () {
    return {
      descricao: ''
    }
  },
  methods: {
    finalizarTarefa (tempoDecorrido: number) : void {
      // Acessa a store via this.store (exposta pelo setup)
      // VUEX seria: this.$store.dispatch('salvarTarefa', { ... })
      // PINIA é:    this.store.salvarTarefa({ ... }) — chamada direta, sem dispatch()
      this.store.salvarTarefa({
        duracaoEmSegundos: tempoDecorrido,
        descricao: this.descricao
      })
      this.descricao = ''
    }
  }
});
</script>
<style>
.formulario {
  color: var(--texto-primario);
  background-color: var(--bg-box);
  border: 1px solid var(--borda-box);
  box-shadow: none;
}

.formulario .input {
  background-color: var(--bg-primario);
  color: var(--texto-primario);
  border-color: var(--borda-box);
}

.formulario .input::placeholder {
  color: var(--texto-secundario);
}
</style>