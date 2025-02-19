"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
  },
  methods: {
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    goToApplicationList() {
      common_vendor.index.navigateTo({
        url: "/pages/application/list"
      });
    },
    goToPostJob() {
      common_vendor.index.navigateTo({
        url: "/pages/job/post"
      });
    },
    goToMessageList() {
      common_vendor.index.switchTab({
        url: "/pages/message/list"
      });
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            this.userInfo = null;
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.userInfo
  }, !$data.userInfo ? {
    b: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  } : common_vendor.e({
    c: common_vendor.t($data.userInfo.name[0]),
    d: common_vendor.t($data.userInfo.name),
    e: common_vendor.t($data.userInfo.userType === 1 ? "求职者" : "企业"),
    f: $data.userInfo.userType === 1
  }, $data.userInfo.userType === 1 ? {
    g: common_vendor.o((...args) => $options.goToApplicationList && $options.goToApplicationList(...args))
  } : {}, {
    h: $data.userInfo.userType === 2
  }, $data.userInfo.userType === 2 ? {
    i: common_vendor.o((...args) => $options.goToPostJob && $options.goToPostJob(...args)),
    j: common_vendor.o((...args) => $options.goToApplicationList && $options.goToApplicationList(...args))
  } : {}, {
    k: common_vendor.o((...args) => $options.goToMessageList && $options.goToMessageList(...args)),
    l: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
