"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      jobId: "",
      jobInfo: {},
      userInfo: null,
      isCollected: false
    };
  },
  onLoad(options) {
    this.jobId = options.id;
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    this.loadJobInfo();
    if (this.userInfo) {
      this.checkCollected();
    }
  },
  methods: {
    async loadJobInfo() {
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
        common_vendor.index.__f__("log", "at pages/job/detail.vue:120", "result", result);
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
    async checkCollected() {
      try {
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: "checkCollected",
            data: {
              userId: this.userInfo.userId,
              jobId: this.jobId
            }
          }
        });
        if (result.result.code === 0) {
          this.isCollected = result.result.data.collected;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/job/detail.vue:156", "检查收藏状态失败", e);
      }
    },
    async handleCollect() {
      if (!this.userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "处理中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: this.isCollected ? "cancelCollect" : "collectJob",
            data: {
              userId: this.userInfo.userId,
              jobId: this.jobId
            }
          }
        });
        if (result.result.code === 0) {
          this.isCollected = !this.isCollected;
          common_vendor.index.showToast({
            title: this.isCollected ? "收藏成功" : "已取消收藏"
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
    async handleApply() {
      if (!this.userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "处理中..."
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
            title: "申请成功"
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
    d: common_vendor.t($data.jobInfo.location),
    e: $data.jobInfo.experience
  }, $data.jobInfo.experience ? {
    f: common_vendor.t($data.jobInfo.experience)
  } : {}, {
    g: $data.jobInfo.education
  }, $data.jobInfo.education ? {
    h: common_vendor.t($data.jobInfo.education)
  } : {}, {
    i: $data.jobInfo.address
  }, $data.jobInfo.address ? {
    j: common_vendor.t($data.jobInfo.address)
  } : {}, {
    k: $data.jobInfo.companyInfo.scale
  }, $data.jobInfo.companyInfo.scale ? {
    l: common_vendor.t($data.jobInfo.companyInfo.scale)
  } : {}, {
    m: $data.jobInfo.companyInfo.registeredCapital
  }, $data.jobInfo.companyInfo.registeredCapital ? {
    n: common_vendor.t($data.jobInfo.companyInfo.registeredCapital)
  } : {}, {
    o: $data.jobInfo.companyInfo.companyDescription
  }, $data.jobInfo.companyInfo.companyDescription ? {
    p: common_vendor.t($data.jobInfo.companyInfo.companyDescription)
  } : {}, {
    q: $data.jobInfo.companyInfo.companyImages && $data.jobInfo.companyInfo.companyImages.length
  }, $data.jobInfo.companyInfo.companyImages && $data.jobInfo.companyInfo.companyImages.length ? {
    r: common_vendor.f($data.jobInfo.companyInfo.companyImages, (image, index, i0) => {
      return {
        a: index,
        b: image
      };
    })
  } : {}, {
    s: common_vendor.t($data.jobInfo.description),
    t: common_vendor.t($data.jobInfo.requirement),
    v: common_vendor.t($data.isCollected ? "★" : "☆"),
    w: common_vendor.t($data.isCollected ? "已收藏" : "收藏"),
    x: $data.isCollected ? 1 : "",
    y: common_vendor.o((...args) => $options.handleCollect && $options.handleCollect(...args)),
    z: common_vendor.o((...args) => $options.handleApply && $options.handleApply(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/job/detail.js.map
