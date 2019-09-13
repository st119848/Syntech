<template>
  <div class="landing_page">
    <div class="">
      <LandingPage />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const LandingPage = () => import("@/components/LandingPage.vue");

export default {
  name: "LandingPageName",
  components: {
    LandingPage
  }
};
</script>
