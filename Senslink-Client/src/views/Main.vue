<template>
  <div class="mail">
    <div class="">
      <Main />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const Main = () => import("@/components/Main.vue");

export default {
  name: "MainName",
  components: {
    Main
  }
};
</script>
