<template>
  <div class="edit_user">
    <b-modal
      ref="modal-edit"
      size="lg"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOkEdit"
    >
      <div slot="modal-title"><strong>แบบฟอร์มแก้ไขบัญชีฝู้ใช้</strong></div>

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
            ห้ามเว้นว่าง
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
            ห้ามเว้นว่าง
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
            ห้ามเว้นว่าง
          </b-form-invalid-feedback>
          <datalist id="section-department-list">
            <option v-for="(each, index) in department_lists" :key="index">{{
              each
            }}</option>
          </datalist>
        </b-form-group>

        <b-form-group
          label-cols-sm="4"
          label="สถานะ/การเข้าถึง:"
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
            ห้ามเว้นว่าง
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
            :state="pwdEditState"
            placeholder="Optional"
            aria-describedby="input-live-feedback"
            trim
          />
          <b-form-invalid-feedback id="input-live-feedback">
            Enter at least 8 letters
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
            อนุญาติรูปแบบ 012-3456789, 012-345-6789, +0123456789
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form-group>

      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">
          แก้ไข
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
  name: "EditUser",

  mixins: [Mixins],

  props: {
    selected_user: {
      type: [Object, String],
      required: true
    }
  },

  data() {
    return {};
  },

  watch: {
    editUserModalState: function(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          let fullname = this.selected_user.fullname.split(" ");
          this.user_id = this.selected_user.user_id;
          this.name = fullname[0];
          this.surname = fullname[1];
          this.department = this.selected_user.department;
          this.level = this.selected_user.level;
          this.username = this.selected_user.username;
          this.email = this.selected_user.email;
          this.tel = this.selected_user.tel;
        });

        this.$refs["modal-edit"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleEditUserModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["editUserModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", ["updateUserState", "toggleEditUserModal"]),

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

    handleOkEdit(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitEdit();
    },

    handleSubmitEdit() {
      if (
        !this.nameState ||
        !this.surnameState ||
        !this.level ||
        !this.departmentState ||
        !this.usernameState ||
        !this.pwdEditState ||
        !this.emailState ||
        !this.telState
      ) {
        return;
      }

      let bodyFormData = new FormData();
      bodyFormData.append("id", this.user_id);
      bodyFormData.append("name", this.name);
      bodyFormData.append("surname", this.surname);
      bodyFormData.append("department", this.department);
      bodyFormData.append("level", this.level);
      bodyFormData.append("username", this.username);
      bodyFormData.append("password", this.password);
      bodyFormData.append("email", this.email);
      bodyFormData.append("tel", this.tel);

      this.$http({
        method: "put",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/user/`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.updateUserState(resp.data);

          this.makeToast(
            "success",
            "ดำเนินการเรียบร้อย",
            `ผู้ใช้งาน ${this.username} ถูกแก้ไขเสร็จสมบูรณ์.`
          );

          this.$nextTick(() => {
            this.$refs["modal-edit"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "ไม่สามารถดำเนินการได้",
            `มีปัญหาในการแก้ไขบัญชีผู้ใช้งาน`
          );
        });
    }
  }
};
</script>

<style scoped></style>
