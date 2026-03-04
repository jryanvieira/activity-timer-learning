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
// DIFERENÇA — SUBSTITUINDO $EMIT POR ACTION DA STORE
// ---------------------------------------------------------------
// ANTES (local state + emit):
//   Ao finalizar uma tarefa, este componente emitia um evento
//   com os dados para o pai (App.vue) tratar:
//
//   emits: ['aoSalvarTarefa'],
//
//   methods: {
//     finalizarTarefa(tempoDecorrido) {
//       this.$emit('aoSalvarTarefa', {         // ← envia ao pai
//         duracaoEmSegundos: tempoDecorrido,
//         descricao: this.descricao
//       })
//     }
//   }
//
//   E o App.vue precisava escutar e salvar:
//   <Formulario @aoSalvarTarefa="salvarTarefa" />
//   methods: { salvarTarefa(t) { this.tarefas.push(t) } }
//
// COM PINIA:
//   Este componente salva na store diretamente.
//   App.vue não precisa mais saber que Formulario existe.
//   A lista de tarefas no template do App.vue atualiza sozinha
//   porque lê o mesmo estado reativo da store.
// ---------------------------------------------------------------
export default defineComponent({
  name: "TarefaFormulario",
  // 'emits' foi removido — a store substitui a necessidade de eventos
  components: {
    Temporizador
  },
  setup() {
    // A store é instanciada aqui no setup() e exposta ao componente.
    // Isso permite que os methods do Options API acessem via this.store.
    // Instanciar no setup() é a prática recomendada — garante que o Pinia
    // já está ativo quando o componente é criado.
    const store = useTarefasStore()
    return { store }
  },
  // ANTES: emits: ['aoSalvarTarefa'] estava declarado aqui.
  data () {
    return {
      descricao: ''
    }
  },
  methods: {
    finalizarTarefa (tempoDecorrido: number) : void {
      // ANTES: this.$emit('aoSalvarTarefa', { duracaoEmSegundos, descricao })
      //        App.vue ouvia e chamava this.tarefas.push(tarefa)
      // AGORA: salva diretamente na store — App.vue atualiza sozinho
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