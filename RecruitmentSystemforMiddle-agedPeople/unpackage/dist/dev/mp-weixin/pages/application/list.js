"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null,
      status: 1,
      page: 1,
      pageSize: 10,
      applicationList: [],
      hasMore: true
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    common_vendor.index.__f__("log", "at pages/application/list.vue:93", "userInfo   ", this.userInfo);
    common_vendor.index.__f__("log", "at pages/application/list.vue:94", "uni.getStorageSync('userInfo')", common_vendor.index.getStorageSync("userInfo"));
    this.resetList();
  },
  methods: {
    handleTabChange(status) {
      this.status = status;
      this.resetList();
    },
    resetList() {
      this.page = 1;
      this.applicationList = [];
      this.hasMore = true;
      this.loadApplicationList();
    },
    async loadApplicationList(loadMore = false) {
      if (!loadMore) {
        this.page = 1;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        common_vendor.index.__f__("log", "at pages/application/list.vue:120", "this.userInfo.userId", this.userInfo);
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: "getApplicationList",
            data: {
              userId: this.userInfo.userId,
              userType: this.userInfo.userType,
              status: this.status,
              page: this.page,
              pageSize: this.pageSize
            }
          }
        });
        if (result.result.code === 0) {
          const { list, total } = result.result.data;
          if (loadMore) {
            this.applicationList = [...this.applicationList, ...list];
          } else {
            this.applicationList = list;
          }
          this.hasMore = this.applicationList.length < total;
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
    loadMore() {
      if (this.hasMore) {
        this.page++;
        this.loadApplicationList(true);
      }
    },
    async handleApplication(applicationId, status) {
      common_vendor.index.showLoading({
        title: "处理中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: "handleApplication",
            data: {
              applicationId,
              status
            }
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.showToast({
            title: "操作成功",
            icon: "success"
          });
          this.resetList();
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
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return "待处理";
        case 2:
          return "已通过";
        case 3:
          return "已拒绝";
        default:
          return "未知状态";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.status === 1 ? 1 : "",
    b: common_vendor.o(($event) => $options.handleTabChange(1)),
    c: $data.status === 2 ? 1 : "",
    d: common_vendor.o(($event) => $options.handleTabChange(2)),
    e: $data.status === 3 ? 1 : "",
    f: common_vendor.o(($event) => $options.handleTabChange(3)),
    g: common_vendor.f($data.applicationList, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.jobInfo[0].title),
        b: common_vendor.t(item.jobInfo[0].salary)
      }, this.userInfo.userType === 1 ? {
        c: common_vendor.t(item.jobInfo[0].companyName)
      } : {}, this.userInfo.userType === 2 ? {
        d: common_vendor.t(item.userInfo[0].name),
        e: common_vendor.t($options.formatTime(item.createTime))
      } : {}, {
        f: common_vendor.t($options.getStatusText(item.status)),
        g: common_vendor.n("status-" + item.status),
        h: this.userInfo.userType === 2 && item.status === 1
      }, this.userInfo.userType === 2 && item.status === 1 ? {
        i: common_vendor.o(($event) => $options.handleApplication(item._id, 2), item._id),
        j: common_vendor.o(($event) => $options.handleApplication(item._id, 3), item._id)
      } : {}, {
        k: item._id
      });
    }),
    h: this.userInfo.userType === 1,
    i: this.userInfo.userType === 2,
    j: $data.hasMore
  }, $data.hasMore ? {
    k: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/application/list.js.map
