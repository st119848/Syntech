<template>
  <div class="delete_user">
    <b-modal ref="modal-delete" size="sm" centered>
      <div slot="modal-title"><strong>ยืนยันการลบบัญชีผู้ใช้</strong></div>

      <div>ยืนยันการลบบัญชี {{ name }} {{ surname }}</div>

      <div slot="modal-footer" class="w-100">
        <b-button
          block
          variant="danger"
          size="sm"
          @click="handleSubmitDelete(user_id)"
        >
          ลบ
        </b-button>
      </div>
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
    deleteUserModalState: function(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          let fullname = this.selected_user.fullname.split(" ");
          this.user_id = this.selected_user.user_id;
          this.name = fullname[0];
          this.surname = fullname[1];
        });

        this.$refs["modal-delete"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleDeleteUserModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["deleteUserModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", [
      "deleteUserState",

      "toggleDeleteUserModal"
    ]),

    handleSubmitDelete(user_id) {
      let bodyFormData = new FormData();
      bodyFormData.append("id", user_id);

      this.$http({
        method: "delete",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/user/`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.deleteUserState(resp.data);

          this.makeToast(
            "success",
            "Delete User",
            `User ${this.username} has been deleted.`
          );

          this.$nextTick(() => {
            this.$refs["modal-delete"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "Delete User",
            `There is an error deleting user.`
          );
        });
    }
  }
};
</script>

<style scoped></style>
