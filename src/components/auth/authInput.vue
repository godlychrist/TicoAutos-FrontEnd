<!--
  authInput.vue - Input reutilizable para formularios de autenticación.

  Implementa v-model bidireccional usando modelValue/update:modelValue.
  Usa el patrón de "floating label" (placeholder=" " + CSS :placeholder-shown).
-->
<template>
  <div class="input-field">
    <input 
      :type="type" 
      :id="id" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder=" "
    />
    <label :for="id">{{ label }}</label>
    <div class="underline"></div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  id: String
});

defineEmits(['update:modelValue']);
</script>

