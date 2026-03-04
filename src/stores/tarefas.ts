// ============================================================
// STORE DE TAREFAS COM PINIA
// ============================================================
//
// DIFERENÇA #1 — CRIAÇÃO DO ESTADO CENTRALIZADO
// ---------------------------------------------------------------
// ANTES (local state + emit):
//   Não havia um lugar central para o estado. Cada componente
//   guardava seu próprio pedaço de estado com data() e avisava
//   o pai via $emit quando algo mudava:
//
//   // BarraLateral.vue
//   data() { return { modoEscuroAtivo: false } }
//   this.$emit('aoTemaAlterado', this.modoEscuroAtivo)
//
//   // App.vue ouvia e armazenava tudo:
//   data() { return { tarefas: [], modoEscuroAtivo: false } }
//   methods: { trocarTema(val) { this.modoEscuroAtivo = val } }
//
// COM PINIA:
//   O estado vive em um único lugar — a store. Qualquer componente
//   pode ler ou alterar diretamente, sem precisar de emit/props.
//   defineStore() cria essa store com um ID único (string).
// ---------------------------------------------------------------

import { defineStore } from 'pinia'
import ITarefa from '../interfaces/ITarefa'

// defineStore recebe dois argumentos:
//   1) ID único da store (string) — nome que identifica esta store.
//   2) Objeto de opções com state, getters e actions.
export const useTarefasStore = defineStore('tarefas', {

  // ---------------------------------------------------------------
  // DIFERENÇA #2 — STATE
  // ---------------------------------------------------------------
  // ANTES (local state + emit):
  //   O estado ficava espalhado: cada componente tinha seu data().
  //   App.vue centralizava manualmente ouvindo eventos dos filhos:
  //
  //   // App.vue
  //   data() {
  //     return {
  //       tarefas: [] as ITarefa[],   // acumulado via @aoSalvarTarefa
  //       modoEscuroAtivo: false      // atualizado via @aoTemaAlterado
  //     }
  //   }
  //
  // COM PINIA:
  //   O estado fica aqui, na store. É uma função que retorna o objeto
  //   — isso garante que cada instância tenha estado isolado (SSR).
  //   Qualquer componente acessa diretamente: store.tarefas
  // ---------------------------------------------------------------
  state: () => ({
    tarefas: [] as ITarefa[],
    modoEscuroAtivo: false
  }),

  // ---------------------------------------------------------------
  // DIFERENÇA #3 — GETTERS (valores derivados do estado)
  // ---------------------------------------------------------------
  // ANTES (local state + emit):
  //   Valores derivados eram computed() locais em cada componente
  //   que precisasse deles. Se dois componentes precisassem do mesmo
  //   valor derivado, a lógica era duplicada:
  //
  //   // App.vue
  //   computed: {
  //     listaEstaVazia() { return this.tarefas.length === 0 }
  //   }
  //
  // COM PINIA:
  //   Getters ficam na store e são compartilhados por todos.
  //   Acesso direto: store.listaEstaVazia (sem chamar como função)
  // ---------------------------------------------------------------
  getters: {
    listaEstaVazia: (state): boolean => state.tarefas.length === 0
  },

  // ---------------------------------------------------------------
  // DIFERENÇA #4 — ACTIONS (como o estado é alterado)
  // ---------------------------------------------------------------
  // ANTES (local state + emit):
  //   Para alterar o estado de outro componente era preciso:
  //   1. Filho emite um evento com $emit
  //   2. Pai escuta o evento no template (@evento="método")
  //   3. Pai executa um método que altera seu próprio data()
  //
  //   // Formulario.vue
  //   this.$emit('aoSalvarTarefa', { duracaoEmSegundos, descricao })
  //
  //   // App.vue template
  //   <Formulario @aoSalvarTarefa="salvarTarefa" />
  //
  //   // App.vue methods
  //   salvarTarefa(tarefa) { this.tarefas.push(tarefa) }
  //
  // COM PINIA:
  //   Qualquer componente chama a action diretamente na store.
  //   Sem emit, sem ouvir evento no pai, sem método intermediário.
  // ---------------------------------------------------------------
  actions: {
    // Qualquer componente pode chamar store.salvarTarefa(tarefa)
    // sem precisar emitir evento e sem que o App.vue precise ouvir nada
    salvarTarefa(tarefa: ITarefa) {
      this.tarefas.push(tarefa)
    },

    // Qualquer componente pode chamar store.trocarTema()
    // sem precisar emitir evento para o App.vue
    trocarTema() {
      this.modoEscuroAtivo = !this.modoEscuroAtivo
    }
  }
})

// ---------------------------------------------------------------
// DIFERENÇA #5 — COMO USAR NOS COMPONENTES
// ---------------------------------------------------------------
// ANTES (local state + emit):
//   Cada componente só conhecia seu próprio estado (data).
//   Para compartilhar dados, usava props (pai → filho)
//   e eventos (filho → pai). Quanto mais componentes, mais
//   difícil de rastrear quem alterou o quê.
//
// COM PINIA:
//   import { useTarefasStore } from '@/stores/tarefas'
//   const store = useTarefasStore()
//   store.tarefas                // lê o estado diretamente
//   store.listaEstaVazia         // lê um getter diretamente
//   store.salvarTarefa(tarefa)   // chama uma action diretamente
//
//   Para reatividade com desestruturação, use storeToRefs():
//   const { tarefas } = storeToRefs(store)  ← mantém reatividade ✓
//
// Para reatividade com desestruturação, use storeToRefs():
//   import { storeToRefs } from 'pinia'
//   const { tarefas, modoEscuroAtivo } = storeToRefs(store)
//   // Agora tarefas e modoEscuroAtivo são refs reativas
// ---------------------------------------------------------------
