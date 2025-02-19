"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userType: 1,
      // 1: 求职者, 2: 企业
      phone: "",
      password: "",
      name: ""
    };
  },
  methods: {
    async handleRegister() {
      if (!this.phone || !this.password || !this.name) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      if (!/^1\d{10}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "注册中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "register",
            data: {
              phone: this.phone,
              password: this.password,
              name: this.name,
              userType: this.userType
            }
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: result.result.msg,
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "注册失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    goToLogin() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userType === 1 ? 1 : "",
    b: common_vendor.o(($event) => $data.userType = 1),
    c: $data.userType === 2 ? 1 : "",
    d: common_vendor.o(($event) => $data.userType = 2),
    e: $data.phone,
    f: common_vendor.o(($event) => $data.phone = $event.detail.value),
    g: $data.password,
    h: common_vendor.o(($event) => $data.password = $event.detail.value),
    i: $data.userType === 1 ? "请输入姓名" : "请输入企业名称",
    j: $data.name,
    k: common_vendor.o(($event) => $data.name = $event.detail.value),
    l: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    m: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
