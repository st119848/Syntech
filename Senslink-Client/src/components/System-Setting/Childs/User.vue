<template>
  <div class="user">
    <b-card>
      <h3 slot="header" style="display: table-cell; vertical-align: middle">
        ผู้ใช้
      </h3>

      <b-card-body class="p-0">
        <!-- CREATE USER -->
        <CreateUser />

        <!-- EDIT USER -->
        <EditUser :selected_user="selected_user" />

        <!-- DELETE USER -->
        <DeleteUser :selected_user="selected_user" />

        <b-row class="mx-2 pb-3" align-h="between">
          <b-col sm="12" md="4" lg="2">
            <b-button squared block variant="primary" @click="createUser()"
              >สร้างบัญชีผู้ใช้</b-button
            >
          </b-col>

          <b-col sm="12" md="7" lg="3">
            <b-form-group class="mb-0">
              <b-input-group>
                <b-form-input
                  v-model="filterUser"
                  placeholder="กรอกเพื่อค้นหา"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filterUser" @click="filterUser = ''"
                    >ค้นหา</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <b-table
          hover
          small
          responsive
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items="tableGenerator"
          :fields="fields_options"
          :filter="filterUser"
          :current-page="currentPage"
          :per-page="perPage"
        >
          <template v-slot:cell(action)="data">
            <b-link class="mx-1" style="color: orange" @click="editUser(data.item)">
              แก้ไข
              <!-- <font-awesome-icon size="lg" style="color: orange" icon="edit" /> -->
            </b-link>
            <b-link class="mx-1" style="color: red" @click="deleteUser(data.item)">
              ลบ
              <!-- <font-awesome-icon size="lg" style="color: red" icon="trash" /> -->
            </b-link>
          </template>

          <template v-slot:table-caption>{{ tableCaption }}</template>
        </b-table>

        <b-row>
          <b-col md="6" class="my-1">
            <div class="overflow-auto">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
const CreateUser = () =>
  import("@/components/System-Setting/Childs/User/Create.vue");
const EditUser = () =>
  import("@/components/System-Setting/Childs/User/Edit.vue");
const DeleteUser = () =>
  import("@/components/System-Setting/Childs/User/Delete.vue");

import { mapState, mapActions } from "vuex";

export default {
  name: "User",

  components: {
    CreateUser,
    EditUser,
    DeleteUser
  },

  data() {
    return {
      currentPage: 1,
      totalRows: 1,
      perPage: 15,

      selected_user: "",

      filterUser: null,

      sortBy: "id",
      sortDesc: false,

      fields_options: [
        { key: "user_id", label: "ID" },
        { key: "fullname", label: "ชื่อ นามสกุล" },
        { key: "department", label: "หน่วยงาน" },
        { key: "level", label: "ระดับ" },
        { key: "username", label: "ชื่อบัญชีผู้ใช้" },
        { key: "email", label: "อีเมล" },
        { key: "tel", label: "เบอร์ติดต่อ" },
        { key: "action", label: "ตั้งค่า" }
      ]
    };
  },

  computed: {
    ...mapState("SystemSetting", ["setting_data"]),
    ...mapState(["socket"]),

    tableGenerator() {
      let newData = [];

      for (let i = 0, len = this.setting_data.user.length; i < len; i++) {
        newData.push({
          user_id: this.setting_data.user[i].id,
          fullname: `${this.setting_data.user[i].name} ${this.setting_data.user[i].surname}`,
          department: this.setting_data.user[i].department,
          level: this.setting_data.user[i].level,
          username: this.setting_data.user[i].username,
          password: this.setting_data.user[i].password,
          email: this.setting_data.user[i].email,
          tel: this.setting_data.user[i].tel
        });
      }

      return newData;
    },

    tableCaption() {
      let start =
        Array.isArray(this.tableGenerator) && this.tableGenerator.length > 0
          ? (this.currentPage - 1) * this.perPage || 1
          : 0;
      let end =
        this.tableGenerator.length > this.perPage * this.currentPage
          ? this.perPage * this.currentPage
          : this.tableGenerator.length;
      let all = this.tableGenerator.length;

      return `แสดงผล ${start} ถึง ${end} จากทั้งหมด ${all}`;
    }
  },

  watch: {
    tableGenerator: function(newVal) {
      this.totalRows = newVal.length;
    }
  },

  created() {
    this.$http({
      method: "get",
      url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/GetSystemSetting/user`
    })
      .then(resp => {
        this.users(resp.data);
      })
      .catch(err => {
        this.makeToast("danger", "Error fetching User ID", err);
      });
  },

  mounted() {
    this.totalRows = this.tableGenerator.length;
  },

  methods: {
    ...mapActions("SystemSetting", [
      "users",

      "toggleCreateUserModal",
      "toggleEditUserModal",
      "toggleDeleteUserModal"
    ]),

    makeToast(variant = null, body, title) {
      this.$bvToast.toast(title, {
        title: body,
        variant: variant,
        solid: true
      });
    },

    createUser() {
      this.toggleCreateUserModal(true);
    },

    editUser(user) {
      this.selected_user = user;
      this.toggleEditUserModal(true);
    },

    deleteUser(user) {
      this.selected_user = user;
      this.toggleDeleteUserModal(true);
    }
  }
};
</script>

<style scoped>
h3 {
  font-family: "Kanit", sans-serif;
}
</style>
