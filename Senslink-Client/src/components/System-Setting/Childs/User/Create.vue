<template>
  <div class="create_user">
    <b-modal
      ref="modal-create"
      size="lg"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOkCreate"
    >
      <div slot="modal-title"><strong>สร้างบัญชีผู้ใช้ใหม่</strong></div>
      <b-form-group>
        <b-form-group
          label-cols-sm="4"
          label="ชื่อ:"
          label-align-sm="left"
          label-for="nested-name"
        >
          <b-form-input
            id="nested-name"
            v-model="name"
            :state="nameState"
            aria-describedby="input-live-feedback"
          />
          <b-form-invalid-feedback id="input-live-feedback">
            กรุณากรอกข้อมูล
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="นามสกุล:"
          label-align-sm="left"
          label-for="nested-surname"
        >
          <b-form-input
            id="nested-surname"
            v-model="surname"
            :state="surnameState"
            aria-describedby="input-live-feedback"
          />
          <b-form-invalid-feedback id="input-live-feedback">
            กรุณากรอกข้อมูล
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="หน่วยงาน:"
          label-align-sm="left"
          label-for="nested-section-department"
        >
          <b-form-input
            id="nested-section-department"
            list="section-department-list"
            v-model="department"
            :state="departmentState"
            aria-describedby="input-live-feedback"
          />
          <b-form-invalid-feedback id="input-live-feedback">
            กรุณากรอกข้อมูล
          </b-form-invalid-feedback>
          <datalist id="section-department-list">
            <option v-for="(each, index) in department_lists" :key="index">{{
              each
            }}</option>
          </datalist>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="สิทธิการใช้งาน:"
          label-align-sm="left"
          label-for="nested-account-level"
        >
          <b-form-select
            id="nested-level"
            v-model="level"
            :options="accLevelOptions"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="ชื่อบัญชีผู้ใช้:"
          label-align-sm="left"
          label-for="nested-username"
        >
          <b-form-input
            id="nested-username"
            v-model="username"
            :formatter="usernameFormat"
            :state="usernameState"
            aria-describedby="input-live-feedback"
          />
          <b-form-text id="input-live-feedback">
            อนุญาติเฉพาะอักษรภาษาอังกฤษตัวพิมพ์เล็ก
          </b-form-text>
          <b-form-invalid-feedback id="input-live-feedback">
            กรุณากรอกข้อมูล
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="รหัสผ่าน:"
          label-align-sm="left"
          label-for="nested-password"
        >
          <b-form-input
            id="nested-password"
            v-model="password"
            :state="pwdState"
            aria-describedby="input-live-feedback"
            trim
          />
          <b-form-invalid-feedback id="input-live-feedback">
            ต้องการอย่างน้อย 8 ตัวอักษร
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="อีเมล:"
          label-align-sm="left"
          label-for="nested-email"
        >
          <b-form-input
            id="nested-email"
            v-model="email"
            :state="emailState"
            aria-describedby="input-live-feedback"
            trim
          />
          <b-form-invalid-feedback id="input-live-feedback">
            ใช้อีเมลที่มีอยู่จริงเท่านั้น
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="เบอร์ติดต่อ:"
          label-align-sm="left"
          label-for="nested-tel"
        >
          <b-form-input
            id="nested-tel"
            v-model="tel"
            :state="telState"
            aria-describedby="input-live-feedback"
            trim
          />
          <b-form-invalid-feedback id="input-live-feedback">
            อนุญาติรูปแบบ 02-123-4567, 081-234-5678
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form-group>

      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">
          สร้าง
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          ยกเลิก
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Mixins from "./Mixins.js";

export default {
  name: "CreateUser",

  mixins: [Mixins],

  data() {
    return {};
  },

  watch: {
    createUserModalState: function(newVal) {
      if (newVal) {
        this.$refs["modal-create"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleCreateUserModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["createUserModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", ["appendUser", "toggleCreateUserModal"]),

    resetModal() {
      this.name = "";
      this.surname = "";
      this.department = "";
      this.level = "";
      this.username = "";
      this.password = "";
      this.email = "";
      this.tel = "";
    },

    handleOkCreate(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitCreate();
    },

    handleSubmitCreate() {
      if (
        !this.nameState ||
        !this.surnameState ||
        !this.level ||
        !this.departmentState ||
        !this.usernameState ||
        !this.pwdState ||
        !this.emailState ||
        !this.telState
      ) {
        return;
      }

      let bodyFormData = new FormData();
      bodyFormData.append("name", this.name);
      bodyFormData.append("surname", this.surname);
      bodyFormData.append("department", this.department);
      bodyFormData.append("level", this.level);
      bodyFormData.append("username", this.username);
      bodyFormData.append("password", this.password);
      bodyFormData.append("email", this.email);
      bodyFormData.append("tel", this.tel);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/user/`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.appendUser(resp.data);

          this.makeToast(
            "success",
            "ดำเนินการเรียบร้อย",
            `ผู้ใช้งาน ${this.username} ถูกสร้างเสร็จสมบูรณ์.`
          );

          this.$nextTick(() => {
            this.$refs["modal-create"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "ไม่สามารถดำเนินการได้",
            `มีปัญหาในการสร้างบัญชีผู้ใช้งาน`
          );
        });
    }
  }
};
</script>

<style scoped></style>
