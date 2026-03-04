// ============================================================
// STORE DE TAREFAS COM PINIA
// ============================================================
//
// DIFERENÇA #1 — CRIAÇÃO DA STORE
// ---------------------------------------------------------------
// VUEX:
//   export default createStore({
//     state: { ... },
//     mutations: { ... },
//     actions: { ... },
//     getters: { ... }
//   })
//
// PINIA:
//   Usa a função defineStore() com um ID único (string).
//   Não existe separação entre mutations e actions — tudo é action.
//   Não existe o conceito de "modules" aninhados; cada store já
//   é um módulo independente com seu próprio ID.
// ---------------------------------------------------------------

import { defineStore } from 'pinia'
import ITarefa from '../interfaces/ITarefa'

// defineStore recebe dois argumentos:
//   1) ID único da store (string) — equivale ao "namespace" do Vuex.
//   2) Objeto de opções com state, getters e actions.
export const useTarefasStore = defineStore('tarefas', {

  // ---------------------------------------------------------------
  // DIFERENÇA #2 — STATE
  // ---------------------------------------------------------------
  // VUEX:
  //   state: {
  //     tarefas: [] as ITarefa[],
  //     modoEscuroAtivo: false
  //   }
  //
  // PINIA:
  //   state deve ser uma FUNÇÃO que retorna o objeto.
  //   Isso garante que cada instância da store tenha seu próprio
  //   estado isolado (importante para SSR).
  //   O TypeScript infere os tipos automaticamente do valor retornado.
  // ---------------------------------------------------------------
  state: () => ({
    tarefas: [] as ITarefa[],
    modoEscuroAtivo: false
  }),

  // ---------------------------------------------------------------
  // DIFERENÇA #3 — GETTERS
  // ---------------------------------------------------------------
  // VUEX:
  //   getters: {
  //     listaEstaVazia: (state) => state.tarefas.length === 0
  //   }
  //
  // PINIA:
  //   Getters são idênticos conceitualmente, mas o acesso a OUTROS
  //   getters é feito via "this" em vez de receber "getters" como
  //   segundo argumento, o que é mais natural e limpo.
  // ---------------------------------------------------------------
  getters: {
    listaEstaVazia: (state): boolean => state.tarefas.length === 0
  },

  // ---------------------------------------------------------------
  // DIFERENÇA #4 — ACTIONS (sem mutations!)
  // ---------------------------------------------------------------
  // VUEX:
  //   Para alterar o state era OBRIGATÓRIO passar por uma mutation
  //   síncrona. Actions só podiam chamar mutations, nunca alterar
  //   o state diretamente:
  //
  //   mutations: {
  //     ADICIONAR_TAREFA(state, tarefa) { state.tarefas.push(tarefa) }
  //   },
  //   actions: {
  //     salvarTarefa({ commit }, tarefa) { commit('ADICIONAR_TAREFA', tarefa) }
  //   }
  //
  // PINIA:
  //   NÃO EXISTEM MUTATIONS. As actions alteram o state diretamente
  //   via "this". Podem ser síncronas ou assíncronas (async/await)
  //   sem distinção. O código fica muito mais simples e direto.
  // ---------------------------------------------------------------
  actions: {
    // Adiciona uma nova tarefa à lista
    salvarTarefa(tarefa: ITarefa) {
      // Em Pinia, acessa-se o state diretamente via "this"
      // Em Vuex seria: state.tarefas.push(tarefa) dentro de uma mutation
      this.tarefas.push(tarefa)
    },

    // Alterna entre modo claro e escuro
    trocarTema() {
      // Mutação direta do state — sem necessidade de commit()
      this.modoEscuroAtivo = !this.modoEscuroAtivo
    }
  }
})

// ---------------------------------------------------------------
// DIFERENÇA #5 — COMO USAR NOS COMPONENTES
// ---------------------------------------------------------------
// VUEX:
//   import { useStore } from 'vuex'
//   const store = useStore()
//   store.state.tarefas          // state
//   store.getters.listaEstaVazia // getter
//   store.commit('MUTACAO')      // mutation
//   store.dispatch('action')     // action
//
// PINIA:
//   import { useTarefasStore } from '@/stores/tarefas'
//   const store = useTarefasStore()
//   store.tarefas                // state (acesso direto!)
//   store.listaEstaVazia         // getter (acesso direto!)
//   store.salvarTarefa(tarefa)   // action (chamada direta!)
//
// Para reatividade com desestruturação, use storeToRefs():
//   import { storeToRefs } from 'pinia'
//   const { tarefas, modoEscuroAtivo } = storeToRefs(store)
//   // Agora tarefas e modoEscuroAtivo são refs reativas
// ---------------------------------------------------------------
