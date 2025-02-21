"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null,
      page: 1,
      pageSize: 10,
      jobList: [],
      hasMore: true
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    if (this.userInfo) {
      this.resetList();
    }
  },
  methods: {
    resetList() {
      this.page = 1;
      this.jobList = [];
      this.hasMore = true;
      this.loadCollectionList();
    },
    async loadCollectionList(loadMore = false) {
      if (!this.userInfo)
        return;
      if (!loadMore) {
        this.page = 1;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: "getCollectionList",
            data: {
              userId: this.userInfo.userId,
              page: this.page,
              pageSize: this.pageSize
            }
          }
        });
        if (result.result.code === 0) {
          const { list, total } = result.result.data;
          if (loadMore) {
            this.jobList = [...this.jobList, ...list];
          } else {
            this.jobList = list;
          }
          this.hasMore = this.jobList.length < total;
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
        this.loadCollectionList(true);
      }
    },
    async handleCancelCollect(jobId) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消收藏吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            try {
              const result = await common_vendor.er.callFunction({
                name: "jobCenter",
                data: {
                  action: "cancelCollect",
                  data: {
                    userId: this.userInfo.userId,
                    jobId
                  }
                }
              });
              if (result.result.code === 0) {
                common_vendor.index.showToast({
                  title: "已取消收藏"
                });
                this.jobList = this.jobList.filter((job) => job._id !== jobId);
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
      });
    },
    goToJobDetail(jobId) {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      });
    },
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      if (date.toDateString() === now.toDateString()) {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `昨天 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.userInfo
  }, !$data.userInfo ? {
    b: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  } : common_vendor.e({
    c: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: common_vendor.t(job.title),
        b: common_vendor.t(job.salary),
        c: common_vendor.t(job.companyName),
        d: common_vendor.t(job.location),
        e: common_vendor.f(job.tags, (tag, index, i1) => {
          return {
            a: common_vendor.t(tag),
            b: index
          };
        }),
        f: common_vendor.t($options.formatTime(job.createTime)),
        g: common_vendor.o(($event) => $options.handleCancelCollect(job._id), job._id),
        h: job._id,
        i: common_vendor.o(($event) => $options.goToJobDetail(job._id), job._id)
      };
    }),
    d: $data.hasMore
  }, $data.hasMore ? {
    e: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    f: $data.jobList.length === 0
  }, $data.jobList.length === 0 ? {} : {}));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/list.js.map
