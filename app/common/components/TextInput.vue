<template>
  <div class="input-field">
    <textarea :placeholder="placeholder" :id="fieldId" class="materialize-textarea" :maxlength="maxlength || 9999" v-model="fvalue" :disabled="disabled" v-if="multiline"></textarea>
    <input :placeholder="placeholder" :id="fieldId" type="text" :class="{validate: validate}" :maxlength="maxlength || 9999" v-model="fvalue" :disabled="disabled" ref="input" v-else>
    <label :for="fieldId">{{label}}</label>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text'
    },
    validate: {
      type: Boolean,
      default: false,
    },
    multiline: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    maxlength: {
      type: Number,
      default: 0,
    },
    value: String,
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      fieldId: 's' + Math.round(Math.random() * (~new Date())),
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
  },
  methods: {
    focus () {
      this.$refs.input.focus();
    }
  },
  mounted () {

  }
}
</script>