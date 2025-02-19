"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null,
      keyword: "",
      page: 1,
      pageSize: 10,
      jobList: [],
      userList: [],
      hasMore: true
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    this.resetList();
  },
  onPullDownRefresh() {
    this.resetList();
  },
  methods: {
    resetList() {
      this.page = 1;
      this.jobList = [];
      this.userList = [];
      this.hasMore = true;
      this.loadData();
    },
    handleSearch() {
      this.resetList();
    },
    async loadData(loadMore = false) {
      if (!this.userInfo)
        return;
      if (!loadMore) {
        this.page = 1;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        if (this.userInfo.userType === 1) {
          await this.loadJobList(loadMore);
        } else {
          await this.loadUserList(loadMore);
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
        common_vendor.index.stopPullDownRefresh();
      }
    },
    async loadJobList(loadMore) {
      const result = await common_vendor.er.callFunction({
        name: "jobCenter",
        data: {
          action: "getJobList",
          data: {
            keyword: this.keyword,
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
    },
    async loadUserList(loadMore) {
      const result = await common_vendor.er.callFunction({
        name: "userInformationCenter",
        data: {
          action: "getUserList",
          data: {
            keyword: this.keyword,
            userType: 1,
            // 只查询求职者
            page: this.page,
            pageSize: this.pageSize
          }
        }
      });
      if (result.result.code === 0) {
        const { list, total } = result.result.data;
        if (loadMore) {
          this.userList = [...this.userList, ...list];
        } else {
          this.userList = list;
        }
        this.hasMore = this.userList.length < total;
      } else {
        common_vendor.index.showToast({
          title: result.result.msg,
          icon: "none"
        });
      }
    },
    loadMore() {
      if (this.hasMore) {
        this.page++;
        this.loadData(true);
      }
    },
    goToJobDetail(jobId) {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      });
    },
    goToUserDetail(userId) {
      common_vendor.index.navigateTo({
        url: `/pages/user/detail?id=${userId}`
      });
    },
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e;
  return common_vendor.e({
    a: ((_a = $data.userInfo) == null ? void 0 : _a.userType) === 1 ? "搜索职位" : "搜索求职者",
    b: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    c: $data.keyword,
    d: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    e: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    f: ((_b = $data.userInfo) == null ? void 0 : _b.userType) === 1
  }, ((_c = $data.userInfo) == null ? void 0 : _c.userType) === 1 ? {
    g: common_vendor.f($data.jobList, (job, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(job.title),
        b: common_vendor.t(job.salary),
        c: common_vendor.t(job.companyName),
        d: job.experience
      }, job.experience ? {
        e: common_vendor.t(job.experience)
      } : {}, {
        f: job.education
      }, job.education ? {
        g: common_vendor.t(job.education)
      } : {}, {
        h: job.location
      }, job.location ? {
        i: common_vendor.t(job.location)
      } : {}, {
        j: common_vendor.t(job.description),
        k: job._id,
        l: common_vendor.o(($event) => $options.goToJobDetail(job._id), job._id)
      });
    })
  } : ((_d = $data.userInfo) == null ? void 0 : _d.userType) === 2 ? {
    i: common_vendor.f($data.userList, (user, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(user.name),
        b: user.age
      }, user.age ? {
        c: common_vendor.t(user.age)
      } : {}, {
        d: user.experience
      }, user.experience ? {
        e: common_vendor.t(user.experience)
      } : {}, {
        f: user.education
      }, user.education ? {
        g: common_vendor.t(user.education)
      } : {}, {
        h: user.location
      }, user.location ? {
        i: common_vendor.t(user.location)
      } : {}, {
        j: common_vendor.t(user.jobIntention || "暂无"),
        k: user._id,
        l: common_vendor.o(($event) => $options.goToUserDetail(user._id), user._id)
      });
    })
  } : {
    j: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    h: ((_e = $data.userInfo) == null ? void 0 : _e.userType) === 2,
    k: $data.hasMore
  }, $data.hasMore ? {
    l: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
