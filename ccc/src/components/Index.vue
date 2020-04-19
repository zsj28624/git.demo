<template>
  <div class="page home">
    加载中 ...
  </div>
</template>
<script>
export default {
  components: {},
  data() {
     return {

     }
  },
  mounted() {

  }, 
  activated() {
    this.load();
  },
  methods: {
    load: function () {
      this.$bus.$emit('go-work');
    }
  }
}
</script>
<style>

</style>


