"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      jobId: "",
      jobInfo: {},
      userInfo: null
    };
  },
  onLoad(options) {
    this.jobId = options.id;
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    this.loadJobDetail();
  },
  methods: {
    async loadJobDetail() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: "getJobDetail",
            data: {
              jobId: this.jobId
            }
          }
        });
        if (result.result.code === 0) {
          this.jobInfo = result.result.data;
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
    async handleApply() {
      if (!this.userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "申请中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: "apply",
            data: {
              userId: this.userInfo.userId,
              jobId: this.jobId
            }
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.showToast({
            title: "申请成功",
            icon: "success"
          });
          await common_vendor.er.callFunction({
            name: "messageCenter",
            data: {
              action: "sendMessage",
              data: {
                senderId: this.userInfo.userId,
                receiverId: this.jobInfo.companyId,
                type: 2,
                title: "新的职位申请",
                content: `${this.userInfo.name}申请了职位：${this.jobInfo.title}`
              }
            }
          });
        } else {
          common_vendor.index.showToast({
            title: result.result.msg,
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "申请失败，请重试",
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
    a: common_vendor.t($data.jobInfo.title),
    b: common_vendor.t($data.jobInfo.salary),
    c: common_vendor.t($data.jobInfo.companyName),
    d: $data.jobInfo.experience
  }, $data.jobInfo.experience ? {
    e: common_vendor.t($data.jobInfo.experience)
  } : {}, {
    f: $data.jobInfo.education
  }, $data.jobInfo.education ? {
    g: common_vendor.t($data.jobInfo.education)
  } : {}, {
    h: $data.jobInfo.location
  }, $data.jobInfo.location ? {
    i: common_vendor.t($data.jobInfo.location)
  } : {}, {
    j: common_vendor.t($data.jobInfo.description),
    k: common_vendor.t($data.jobInfo.requirement),
    l: common_vendor.t($data.jobInfo.address),
    m: $data.userInfo && $data.userInfo.userType === 1
  }, $data.userInfo && $data.userInfo.userType === 1 ? {
    n: common_vendor.o((...args) => $options.handleApply && $options.handleApply(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/job/detail.js.map
