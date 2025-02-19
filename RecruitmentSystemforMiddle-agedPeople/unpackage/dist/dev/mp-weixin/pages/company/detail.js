"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      companyId: "",
      companyInfo: {},
      page: 1,
      pageSize: 10,
      jobList: [],
      hasMore: true
    };
  },
  onLoad(options) {
    this.companyId = options.id;
    this.loadCompanyInfo();
    this.loadJobList();
  },
  onPullDownRefresh() {
    this.resetList();
  },
  methods: {
    resetList() {
      this.page = 1;
      this.jobList = [];
      this.hasMore = true;
      Promise.all([
        this.loadCompanyInfo(),
        this.loadJobList()
      ]).finally(() => {
        common_vendor.index.stopPullDownRefresh();
      });
    },
    async loadCompanyInfo() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "getCompanyInfo",
            data: {
              companyId: this.companyId
            }
          }
        });
        if (result.result.code === 0) {
          this.companyInfo = result.result.data;
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
    async loadJobList(loadMore = false) {
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
            action: "getCompanyJobList",
            data: {
              companyId: this.companyId,
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
        this.loadJobList(true);
      }
    },
    goToJobDetail(jobId) {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.companyInfo.name),
    b: $data.companyInfo.industry
  }, $data.companyInfo.industry ? {
    c: common_vendor.t($data.companyInfo.industry)
  } : {}, {
    d: $data.companyInfo.scale
  }, $data.companyInfo.scale ? {
    e: common_vendor.t($data.companyInfo.scale)
  } : {}, {
    f: $data.companyInfo.location
  }, $data.companyInfo.location ? {
    g: common_vendor.t($data.companyInfo.location)
  } : {}, {
    h: $data.companyInfo.description
  }, $data.companyInfo.description ? {
    i: common_vendor.t($data.companyInfo.description)
  } : {}, {
    j: common_vendor.t($data.jobList.length),
    k: common_vendor.f($data.jobList, (job, k0, i0) => {
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
        i: common_vendor.t(job.description),
        j: job._id,
        k: common_vendor.o(($event) => $options.goToJobDetail(job._id), job._id)
      });
    }),
    l: $data.hasMore
  }, $data.hasMore ? {
    m: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/company/detail.js.map
