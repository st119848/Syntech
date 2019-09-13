export default {
  data() {
    return {
      user_id: "",

      name: "",
      surname: "",
      department: "",
      level: "",
      username: "",
      password: "",
      email: "",
      tel: "",

      accLevelOptions: [
        { value: "", text: "Please select an option" },
        { value: "user", text: "Ordinary User" },
        { value: "power", text: "Power User" },
        { value: "admin", text: "Administrative" }
      ],

      department_lists: ["Company"]
    };
  },

  computed: {
    nameState() {
      let re = /\s/;
      return !re.test(String(this.name)) && this.name.length > 0;
    },
    surnameState() {
      let re = /\s/;
      return !re.test(String(this.surname)) && this.surname.length > 0;
    },
    departmentState() {
      let re = /\s/;
      return !re.test(String(this.department)) && this.department.length > 0;
    },
    usernameState() {
      let re = /\s/;
      return !re.test(String(this.username)) && this.username.length > 0;
    },
    pwdState() {
      return Boolean(this.password.length >= 8);
    },
    pwdEditState() {
      return (
        Boolean(this.password === "") || Boolean(this.password.length >= 8)
      );
    },
    emailState() {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    telState() {
      let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      return re.test(String(this.tel).toLowerCase());
    }
  },

  watch: {},

  mounted() {},

  methods: {
    makeToast(variant = null, body, title) {
      this.$bvToast.toast(title, {
        title: body,
        variant: variant,
        solid: true
      });
    },

    usernameFormat(value) {
      return value.toLowerCase();
    }
  }
};
