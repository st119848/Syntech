<template>
  <!-- check -->
  <div class="login-box w-100">
    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="warning"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      {{ warning_msg }}
    </b-alert>

    <b-row align-h="center">
      <b-col sm="12" md="10" lg="5">
        <div class="shadow">
          <b-jumbotron class="px-2 py-5" style="background-color: pink;">
            <b-row align-h="center">
              <b-col cols="10">
                <b-jumbotron class="py-2" style="background-color: white;">
                  <b-row align-h="around">
                    <b-col cols="4">
                      <b-img
                        style="width: 100%;"
                        :src="require('../assets/KMUT.png')"
                        alt="KMUT image"
                      />
                    </b-col>
                    <b-col cols="4">
                      <b-img
                        style="width: 100%;"
                        :src="require('../assets/TSRI.png')"
                        alt="TSRI image"
                      />
                    </b-col>
                    <b-col cols="4">
                      <b-img
                        style="width: 100%;"
                        :src="require('../assets/RID.png')"
                        alt="RID image"
                      />
                    </b-col>
                  </b-row>
                </b-jumbotron>
              </b-col>
            </b-row>

            <b-row align-h="center">
              <h2>ลงชื่อเข้าใช้</h2>
            </b-row>

            <b-row align-h="center">
              <b-col cols="8">
                <b-row align-h="around">
                  <b-col cols="2">
                    <font-awesome-icon size="lg" icon="info-circle" />
                  </b-col>
                  <b-col cols="10">
                    <b-form-input
                      id="input-username"
                      v-model="username"
                      type="text"
                      placeholder="ชื่อบัญชี"
                      aria-describedby="input-formatter-help"
                    ></b-form-input>
                  </b-col>
                </b-row>

                <div class="my-2" />

                <b-row align-h="around">
                  <b-col cols="2">
                    <font-awesome-icon size="lg" icon="info-circle" />
                  </b-col>
                  <b-col cols="10">
                    <b-form-input
                      id="input-password"
                      v-model="password"
                      type="password"
                      placeholder="รหัสผ่าน"
                      aria-describedby="input-formatter-help"
                    ></b-form-input>
                  </b-col>
                </b-row>

                <div class="my-2" />

                <b-button
                  block
                  pill
                  variant="success"
                  type="submit"
                  @click="submit()"
                  >เข้าสู้เว็บไซต์</b-button
                >
              </b-col>
            </b-row>
          </b-jumbotron>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      username: "",
      password: "",
      credentials: "",

      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      warning_msg: ""
    };
  },

  created() {
    let adminLTEBody = document.querySelector("body");
    adminLTEBody.classList.add("hold-transition");
    adminLTEBody.classList.add("login-page");
  },

  methods: {
    submit() {
      let bodyFormData = new FormData();
      bodyFormData.append("username", this.username);
      bodyFormData.append("password", this.password);

      console.log(this.username);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/Authentication/login`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          console.log(resp.data);
          this.$store.dispatch("login", resp.data);
          this.$router.push({ name: "dashboard" });
        })
        .catch(err => {
          this.warning_msg = Object.values(err)[2].data;
          this.dismissCountDown = this.dismissSecs;
        });
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    }
  }
};
</script>

<style scoped>
.center {
  margin: auto;
  width: 50%;
  border: 3px solid green;
  padding: 10px;
}
</style>
