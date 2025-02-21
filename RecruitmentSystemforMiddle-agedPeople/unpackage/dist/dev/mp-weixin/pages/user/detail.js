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
        common_vendor.index.__f__("log", "at pages/user/detail.vue:122", "uni.getStorageSync('userInfo')", common_vendor.index.getStorageSync("userInfo"));
        const result = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "getCurrentUser",
            data: {
              userInfo: common_vendor.index.getStorageSync("userInfo")
            }
          }
        });
        common_vendor.index.__f__("log", "at pages/user/detail.vue:132", "result", result);
        if (result.result.code === 0) {
          this.isEmployer = result.result.data.userType === 2;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/detail.vue:138", e);
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
              userId: this.userId,
              companyId: common_vendor.index.getStorageSync("userInfo").userId
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
    },
    async handleMessage() {
      common_vendor.index.showLoading({
        title: "处理中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "messageCenter",
          data: {
            action: "sendMessage",
            data: {
              receiverId: this.userId,
              senderId: common_vendor.index.getStorageSync("userInfo").userId,
              type: 5,
              title: "来自企业的消息",
              isRead: false,
              content: `您好，我是来自${common_vendor.index.getStorageSync("userInfo").name}的HR，我对您的简历很感兴趣，想进一步了解一下,请您联系我，我的联系方式是：${common_vendor.index.getStorageSync("userInfo").phone}。`
            }
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.showToast({
            title: "消息已发送",
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
    a: $data.userInfo.avatar
  }, $data.userInfo.avatar ? {
    b: $data.userInfo.avatar
  } : {
    c: common_vendor.t($data.userInfo.name[0])
  }, {
    d: common_vendor.t($data.userInfo.name),
    e: $data.userInfo.age
  }, $data.userInfo.age ? {
    f: common_vendor.t($data.userInfo.age)
  } : {}, {
    g: $data.userInfo.gender
  }, $data.userInfo.gender ? {
    h: common_vendor.t($data.userInfo.gender === 1 ? "男" : "女")
  } : {}, {
    i: $data.userInfo.education
  }, $data.userInfo.education ? {
    j: common_vendor.t($data.userInfo.education)
  } : {}, {
    k: $data.userInfo.workExperience && $data.userInfo.workExperience.length
  }, $data.userInfo.workExperience && $data.userInfo.workExperience.length ? {
    l: common_vendor.t($data.userInfo.workExperience.length)
  } : {}, {
    m: $data.userInfo.phone
  }, $data.userInfo.phone ? {
    n: common_vendor.t($data.userInfo.phone)
  } : {}, {
    o: $data.userInfo.skills && $data.userInfo.skills.length
  }, $data.userInfo.skills && $data.userInfo.skills.length ? {
    p: common_vendor.f($data.userInfo.skills, (skill, index, i0) => {
      return {
        a: common_vendor.t(skill),
        b: index
      };
    })
  } : {}, {
    q: $data.userInfo.introduction
  }, $data.userInfo.introduction ? {
    r: common_vendor.t($data.userInfo.introduction)
  } : {}, {
    s: $data.userInfo.workExperience && $data.userInfo.workExperience.length
  }, $data.userInfo.workExperience && $data.userInfo.workExperience.length ? {
    t: common_vendor.f($data.userInfo.workExperience, (exp, index, i0) => {
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
    v: $data.isEmployer
  }, $data.isEmployer ? {
    w: common_vendor.o((...args) => $options.handleInvite && $options.handleInvite(...args)),
    x: common_vendor.o((...args) => $options.handleMessage && $options.handleMessage(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/detail.js.map
