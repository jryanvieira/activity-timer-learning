<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <Cronometro :tempoEmSegundos="tempoEmSegundos" />
    <button class="button botao-iniciar" @click="iniciar" :disabled="cronometroRodando">
      <span class="icon">
        <i class="fas fa-play"></i>
      </span>
      <span>Iniciar</span>
    </button>
    <button class="button botao-finalizar" @click="finalizar" :disabled="!cronometroRodando">
      <span class="icon">
        <i class="fas fa-stop"></i>
      </span>
      <span>Finalizar</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cronometro from './Cronometro.vue'

export default defineComponent({
  name: "TarefaTemporizador",
  emits: ['aoTemporizadorFinalizado'],
  components: {
    Cronometro
  },
  data () {
    return {
      tempoEmSegundos: 0,
      cronometro: 0,
      cronometroRodando: false
    }
  },
  methods: {
    iniciar () {
      // começar a contagem
      // 1 seg = 1000 ms
      this.cronometroRodando = true
      this.cronometro = setInterval(() => {
        this.tempoEmSegundos += 1        
      }, 1000)
    },
    finalizar () {
      this.cronometroRodando = false
      clearInterval(this.cronometro)
      this.$emit('aoTemporizadorFinalizado', this.tempoEmSegundos)
      this.tempoEmSegundos = 0
    }
  }
});
</script>

<style scoped>
.botao-iniciar {
  background-color: var(--botao-primario);
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-weight: 700;
}

.botao-iniciar:hover:not(:disabled) {
  background-color: var(--botao-primario-hover);
}

.botao-finalizar {
  background-color: var(--botao-secundario);
  color: var(--botao-secundario-texto);
  border: 1px solid var(--borda-box);
  border-radius: 9999px;
  font-weight: 700;
}

.botao-finalizar:hover:not(:disabled) {
  background-color: var(--bg-box-alt);
}
</style>
