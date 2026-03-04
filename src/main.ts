import { createApp } from 'vue'
import App from './App.vue'

// ---------------------------------------------------------------
// DIFERENÇA — REGISTRO DO PINIA NA APLICAÇÃO
// ---------------------------------------------------------------
// VUEX:
//   import { createStore } from 'vuex'
//   const store = createStore({ ... })
//   createApp(App).use(store).mount('#app')
//
// PINIA:
//   Importa-se createPinia() e registra com .use() da mesma forma.
//   A diferença é que o createPinia() é leve e sem configuração —
//   cada store é definida separadamente em seu próprio arquivo,
//   em vez de tudo centralizado em um único createStore().
// ---------------------------------------------------------------
import { createPinia } from 'pinia'

import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

// Registra o Pinia como plugin na aplicação Vue
app.use(createPinia())

app.mount('#app')
