"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null,
      keyword: "",
      page: 1,
      pageSize: 10,
      companyList: [],
      jobList: [],
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
      this.companyList = [];
      this.jobList = [];
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
          await this.loadCompanyList(loadMore);
        } else {
          await this.loadMyJobList(loadMore);
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
    async loadCompanyList(loadMore) {
      const result = await common_vendor.er.callFunction({
        name: "userInformationCenter",
        data: {
          action: "getCompanyList",
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
          this.companyList = [...this.companyList, ...list];
        } else {
          this.companyList = list;
        }
        this.hasMore = this.companyList.length < total;
      } else {
        common_vendor.index.showToast({
          title: result.result.msg,
          icon: "none"
        });
      }
    },
    async loadMyJobList(loadMore) {
      const result = await common_vendor.er.callFunction({
        name: "jobCenter",
        data: {
          action: "getMyJobList",
          data: {
            userId: this.userInfo.userId,
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
    async handleDeleteJob(jobId) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该职位吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "删除中..."
            });
            try {
              const result = await common_vendor.er.callFunction({
                name: "jobCenter",
                data: {
                  action: "deleteJob",
                  data: {
                    jobId
                  }
                }
              });
              if (result.result.code === 0) {
                common_vendor.index.showToast({
                  title: "删除成功",
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
                title: "删除失败，请重试",
                icon: "none"
              });
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    },
    loadMore() {
      if (this.hasMore) {
        this.page++;
        this.loadData(true);
      }
    },
    goToCompanyDetail(companyId) {
      common_vendor.index.navigateTo({
        url: `/pages/company/detail?id=${companyId}`
      });
    },
    goToJobDetail(jobId) {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      });
    },
    goToEditJob(jobId) {
      common_vendor.index.navigateTo({
        url: `/pages/job/edit?id=${jobId}`
      });
    },
    goToPostJob() {
      common_vendor.index.navigateTo({
        url: "/pages/job/post"
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
    a: ((_a = $data.userInfo) == null ? void 0 : _a.userType) === 1 ? "搜索公司" : "搜索职位",
    b: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    c: $data.keyword,
    d: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    e: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    f: ((_b = $data.userInfo) == null ? void 0 : _b.userType) === 1
  }, ((_c = $data.userInfo) == null ? void 0 : _c.userType) === 1 ? {
    g: common_vendor.f($data.companyList, (company, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(company.name),
        b: common_vendor.t(company.jobCount || 0),
        c: company.industry
      }, company.industry ? {
        d: common_vendor.t(company.industry)
      } : {}, {
        e: company.scale
      }, company.scale ? {
        f: common_vendor.t(company.scale)
      } : {}, {
        g: company.location
      }, company.location ? {
        h: common_vendor.t(company.location)
      } : {}, {
        i: company._id,
        j: common_vendor.o(($event) => $options.goToCompanyDetail(company._id), company._id)
      });
    })
  } : ((_d = $data.userInfo) == null ? void 0 : _d.userType) === 2 ? {
    i: common_vendor.o((...args) => $options.goToPostJob && $options.goToPostJob(...args)),
    j: common_vendor.f($data.jobList, (job, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(job.title),
        b: common_vendor.t(job.salary),
        c: job.experience
      }, job.experience ? {
        d: common_vendor.t(job.experience)
      } : {}, {
        e: job.education
      }, job.education ? {
        f: common_vendor.t(job.education)
      } : {}, {
        g: job.location
      }, job.location ? {
        h: common_vendor.t(job.location)
      } : {}, {
        i: common_vendor.t(job.applicationCount || 0),
        j: common_vendor.o(($event) => $options.goToJobDetail(job._id), job._id),
        k: common_vendor.o(($event) => $options.goToEditJob(job._id), job._id),
        l: common_vendor.o(($event) => $options.handleDeleteJob(job._id), job._id),
        m: job._id
      });
    })
  } : {
    k: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    h: ((_e = $data.userInfo) == null ? void 0 : _e.userType) === 2,
    l: $data.hasMore
  }, $data.hasMore ? {
    m: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/job/list.js.map
