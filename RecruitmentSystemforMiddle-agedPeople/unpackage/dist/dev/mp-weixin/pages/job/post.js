"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null,
      formData: {
        title: "",
        salary: "",
        experience: "",
        education: "",
        location: "",
        address: "",
        description: "",
        requirement: ""
      },
      experienceIndex: 0,
      experienceOptions: [
        "不限",
        "应届生",
        "1-3年",
        "3-5年",
        "5-10年",
        "10年以上"
      ],
      educationIndex: 0,
      educationOptions: [
        "不限",
        "高中",
        "大专",
        "本科",
        "硕士",
        "博士"
      ]
    };
  },
  onLoad() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    if (!this.userInfo || this.userInfo.userType !== 2) {
      common_vendor.index.showToast({
        title: "非企业用户不能发布职位",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
  },
  methods: {
    handleExperienceChange(e) {
      this.experienceIndex = e.detail.value;
      this.formData.experience = this.experienceOptions[this.experienceIndex];
    },
    handleEducationChange(e) {
      this.educationIndex = e.detail.value;
      this.formData.education = this.educationOptions[this.educationIndex];
    },
    async handleSubmit() {
      if (!this.formData.title) {
        common_vendor.index.showToast({
          title: "请输入职位名称",
          icon: "none"
        });
        return;
      }
      if (!this.formData.salary) {
        common_vendor.index.showToast({
          title: "请输入薪资范围",
          icon: "none"
        });
        return;
      }
      if (!this.formData.location) {
        common_vendor.index.showToast({
          title: "请输入工作地点",
          icon: "none"
        });
        return;
      }
      if (!this.formData.description) {
        common_vendor.index.showToast({
          title: "请输入职位描述",
          icon: "none"
        });
        return;
      }
      if (!this.formData.requirement) {
        common_vendor.index.showToast({
          title: "请输入任职要求",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "发布中..."
      });
      try {
        const result = await common_vendor.er.callFunction({
          name: "jobCenter",
          data: {
            action: "postJob",
            data: {
              userId: this.userInfo.userId,
              ...this.formData
            }
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.showToast({
            title: "发布成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: result.result.msg,
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "发布失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.formData.title,
    b: common_vendor.o(($event) => $data.formData.title = $event.detail.value),
    c: $data.formData.salary,
    d: common_vendor.o(($event) => $data.formData.salary = $event.detail.value),
    e: common_vendor.t($data.formData.experience || "请选择工作经验"),
    f: $data.experienceIndex,
    g: $data.experienceOptions,
    h: common_vendor.o((...args) => $options.handleExperienceChange && $options.handleExperienceChange(...args)),
    i: common_vendor.t($data.formData.education || "请选择学历要求"),
    j: $data.educationIndex,
    k: $data.educationOptions,
    l: common_vendor.o((...args) => $options.handleEducationChange && $options.handleEducationChange(...args)),
    m: $data.formData.location,
    n: common_vendor.o(($event) => $data.formData.location = $event.detail.value),
    o: $data.formData.address,
    p: common_vendor.o(($event) => $data.formData.address = $event.detail.value),
    q: $data.formData.description,
    r: common_vendor.o(($event) => $data.formData.description = $event.detail.value),
    s: $data.formData.requirement,
    t: common_vendor.o(($event) => $data.formData.requirement = $event.detail.value),
    v: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/job/post.js.map
