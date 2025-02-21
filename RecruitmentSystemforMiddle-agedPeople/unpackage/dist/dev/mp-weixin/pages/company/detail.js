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
    common_vendor.index.__f__("log", "at pages/company/detail.vue:103", "this.companyInfo", this.companyInfo);
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
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },
    previewImage(current) {
      common_vendor.index.previewImage({
        urls: this.companyInfo.companyImages,
        current
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.companyInfo.avatar
  }, $data.companyInfo.avatar ? {
    b: $data.companyInfo.avatar
  } : {
    c: common_vendor.t($data.companyInfo.name[0])
  }, {
    d: common_vendor.t($data.companyInfo.name),
    e: $data.companyInfo.scale
  }, $data.companyInfo.scale ? {
    f: common_vendor.t($data.companyInfo.scale)
  } : {}, {
    g: $data.companyInfo.registeredCapital
  }, $data.companyInfo.registeredCapital ? {
    h: common_vendor.t($data.companyInfo.registeredCapital)
  } : {}, {
    i: $data.companyInfo.companyDescription
  }, $data.companyInfo.companyDescription ? {
    j: common_vendor.t($data.companyInfo.companyDescription)
  } : {}, {
    k: $data.companyInfo.companyImages && $data.companyInfo.companyImages.length
  }, $data.companyInfo.companyImages && $data.companyInfo.companyImages.length ? {
    l: common_vendor.f($data.companyInfo.companyImages, (img, index, i0) => {
      return {
        a: index,
        b: img,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    })
  } : {}, {
    m: common_vendor.t($data.jobList.length),
    n: common_vendor.f($data.jobList, (job, k0, i0) => {
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
        j: common_vendor.t($options.formatTime(job.createTime)),
        k: job._id,
        l: common_vendor.o(($event) => $options.goToJobDetail(job._id), job._id)
      });
    }),
    o: $data.hasMore
  }, $data.hasMore ? {
    p: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/company/detail.js.map
