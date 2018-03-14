<template>
  <section>
    <LoginModal></LoginModal>
    <router-view></router-view>
    <WebsiteFooter></WebsiteFooter>
  </section>
</template>

<script>
import LoginModal from './common/components/LoginModal.vue'
export default {
  data () {
    return {
      greet: 'Hello World!'
    }
  },
  components: {LoginModal}
}
</script>