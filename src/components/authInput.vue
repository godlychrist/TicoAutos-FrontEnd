<template>
  <div class="input-field" :class="{ 'animate-in': animate }">
    <input 
      :type="type" 
      :id="id" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required" 
      placeholder=" "
    />
    <label :for="id">{{ label }}</label>
    <div class="underline"></div>
  </div>
</template>

<script>
export default {
  name: 'authInput',
  props: {
    modelValue: [String, Number],
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    id: String,
    required: {
      type: Boolean,
      default: false
    },
    animate: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>
