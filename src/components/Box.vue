<template>
  <!-- o :style aplica estilos dinamicamente -->
  <div class="box has-text-weight-bold" :style="estilos">
    <!--
      O slot é um recurso do Vue que permite que o conteúdo seja inserido dentro de um componente, 
      tornando-o mais flexível e reutilizável. Ele é especialmente útil quando queremos criar componentes 
      genéricos que podem ser personalizados com diferentes conteúdos em diferentes contextos.
    -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppBox',
  data () {
    return {
      estilos: {
        backgroundColor: '#FAF0CA'
      }
    }
  }
})
</script>
