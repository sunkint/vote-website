<template>
  <div class="switch">
    <label>
      {{offtext}}
      <input type="checkbox" v-model="fvalue">
      <span class="lever"></span>
      {{ontext}}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    offtext: {
      type: String,
      default: '',
    },
    ontext: {
      type: String,
      default: '',
    },
    value: Boolean
  },
  data () {
    return {
      fvalue: this.value,
    }
  },
  watch: {
    fvalue (val) {
      this.$emit('input', val);
    },
    value (val) {
      this.fvalue = val;
    }
  }
}
</script>