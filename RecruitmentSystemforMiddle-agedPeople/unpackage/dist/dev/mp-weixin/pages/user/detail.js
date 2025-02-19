"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userId: "",
      userInfo: {},
      isEmployer: false
    };
  },
  onLoad(options) {
    this.userId = options.id;
    this.loadUserInfo();
    this.checkUserRole();
  },
  methods: {
    async loadUserInfo() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "getUserDetail",
            data: {
              userId: this.userId
            }
          }
        });
        if (result.result.code === 0) {
          this.userInfo = result.result.data;
        } else {
          common_vendor.index.showToast({
            title: result.result.msg,
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    async checkUserRole() {
      try {
        const result = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "getCurrentUser"
          }
        });
        if (result.result.code === 0) {
          this.isEmployer = result.result.data.role === "employer";
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/detail.vue:134", e);
      }
    },
    async handleInvite() {
      common_vendor.index.showLoading({
        title: "处理中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "messageCenter",
          data: {
            action: "sendInvitation",
            data: {
              userId: this.userId
            }
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.showToast({
            title: "邀请已发送",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: result.result.msg,
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "操作失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.userInfo.name),
    b: $data.userInfo.age
  }, $data.userInfo.age ? {
    c: common_vendor.t($data.userInfo.age)
  } : {}, {
    d: $data.userInfo.education
  }, $data.userInfo.education ? {
    e: common_vendor.t($data.userInfo.education)
  } : {}, {
    f: $data.userInfo.experience
  }, $data.userInfo.experience ? {
    g: common_vendor.t($data.userInfo.experience)
  } : {}, {
    h: $data.userInfo.location
  }, $data.userInfo.location ? {
    i: common_vendor.t($data.userInfo.location)
  } : {}, {
    j: $data.userInfo.phone
  }, $data.userInfo.phone ? {
    k: common_vendor.t($data.userInfo.phone)
  } : {}, {
    l: $data.userInfo.jobIntention
  }, $data.userInfo.jobIntention ? common_vendor.e({
    m: $data.userInfo.jobIntention.position
  }, $data.userInfo.jobIntention.position ? {
    n: common_vendor.t($data.userInfo.jobIntention.position)
  } : {}, {
    o: $data.userInfo.jobIntention.salary
  }, $data.userInfo.jobIntention.salary ? {
    p: common_vendor.t($data.userInfo.jobIntention.salary)
  } : {}, {
    q: $data.userInfo.jobIntention.location
  }, $data.userInfo.jobIntention.location ? {
    r: common_vendor.t($data.userInfo.jobIntention.location)
  } : {}, {
    s: $data.userInfo.jobIntention.industry
  }, $data.userInfo.jobIntention.industry ? {
    t: common_vendor.t($data.userInfo.jobIntention.industry)
  } : {}) : {}, {
    v: $data.userInfo.workExperience && $data.userInfo.workExperience.length
  }, $data.userInfo.workExperience && $data.userInfo.workExperience.length ? {
    w: common_vendor.f($data.userInfo.workExperience, (exp, index, i0) => {
      return {
        a: common_vendor.t(exp.company),
        b: common_vendor.t(exp.startTime),
        c: common_vendor.t(exp.endTime),
        d: common_vendor.t(exp.position),
        e: common_vendor.t(exp.description),
        f: index
      };
    })
  } : {}, {
    x: $data.isEmployer
  }, $data.isEmployer ? {
    y: common_vendor.o((...args) => $options.handleInvite && $options.handleInvite(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/detail.js.map
