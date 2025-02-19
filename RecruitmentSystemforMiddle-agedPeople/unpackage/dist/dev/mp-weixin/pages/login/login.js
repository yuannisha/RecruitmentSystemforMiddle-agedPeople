"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    async handleLogin() {
      if (!this.phone || !this.password) {
        common_vendor.index.showToast({
          title: "请输入手机号和密码",
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
        title: "登录中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "login",
            data: {
              phone: this.phone,
              password: this.password
            }
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.setStorageSync("userInfo", result.result.data);
          common_vendor.index.__f__("log", "at pages/login/login.vue:70", "result.result.data", result.result.data);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: result.result.msg,
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.phone,
    b: common_vendor.o(($event) => $data.phone = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    f: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
