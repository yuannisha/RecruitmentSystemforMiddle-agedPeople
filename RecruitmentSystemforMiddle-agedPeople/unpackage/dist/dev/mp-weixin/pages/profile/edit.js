"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userType: 1,
      formData: {
        avatar: "",
        name: "",
        phone: "",
        oldPassword: "",
        password: "",
        // 求职者字段
        gender: 1,
        age: "",
        education: "",
        workExperience: [],
        skills: [],
        introduction: "",
        // 企业字段
        registeredCapital: "",
        scale: "",
        companyDescription: "",
        companyImages: []
      },
      skillInput: "",
      genderOptions: [
        { value: 1, label: "男" },
        { value: 2, label: "女" }
      ],
      educationOptions: ["高中", "专科", "本科", "硕士", "博士"],
      scaleOptions: ["0-20人", "20-99人", "100-499人", "500人以上"]
    };
  },
  onShow() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    common_vendor.index.__f__("log", "at pages/profile/edit.vue:200", "userInfo", userInfo);
    if (userInfo) {
      this.userType = userInfo.userType;
      this.loadUserProfile();
    }
  },
  methods: {
    async loadUserProfile() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo)
        return;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      try {
        const { result } = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "getCurrentUser",
            data: {
              userInfo
            }
          }
        });
        common_vendor.index.__f__("log", "at pages/profile/edit.vue:225", "result", result);
        if (result.code === 0) {
          this.formData = {
            ...this.formData,
            ...result.data,
            oldPassword: "",
            password: ""
          };
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    getGenderLabel(value) {
      const option = this.genderOptions.find((opt) => opt.value === value);
      return option ? option.label : "请选择性别";
    },
    handleGenderChange(e) {
      this.formData.gender = this.genderOptions[e.detail.value].value;
    },
    handleEducationChange(e) {
      this.formData.education = this.educationOptions[e.detail.value];
    },
    handleScaleChange(e) {
      this.formData.scale = this.scaleOptions[e.detail.value];
    },
    addSkill() {
      if (!this.skillInput)
        return;
      if (!this.formData.skills)
        this.formData.skills = [];
      if (!this.formData.skills.includes(this.skillInput)) {
        this.formData.skills.push(this.skillInput);
      }
      this.skillInput = "";
    },
    removeSkill(index) {
      this.formData.skills.splice(index, 1);
    },
    addWorkExperience() {
      if (!this.formData.workExperience)
        this.formData.workExperience = [];
      this.formData.workExperience.push({
        company: "",
        position: "",
        startTime: "",
        endTime: "",
        description: ""
      });
    },
    removeWorkExperience(index) {
      this.formData.workExperience.splice(index, 1);
    },
    handleDateChange(e, index, field) {
      this.formData.workExperience[index][field] = e.detail.value;
    },
    async chooseImage(type) {
      try {
        const res = await common_vendor.index.chooseImage({
          count: type === "avatar" ? 1 : 9,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        common_vendor.index.showLoading({
          title: "上传中"
        });
        const uploadPromises = res.tempFilePaths.map((filePath) => {
          return new Promise((resolve, reject) => {
            common_vendor.er.uploadFile({
              filePath,
              cloudPath: `${type}/${Date.now()}-${Math.random().toString(36).slice(-6)}.${filePath.split(".").pop()}`,
              success: (res2) => {
                resolve(res2.fileID);
              },
              fail: (err) => {
                reject(err);
              }
            });
          });
        });
        const fileIDs = await Promise.all(uploadPromises);
        if (type === "avatar") {
          this.formData.avatar = fileIDs[0];
        } else {
          if (!this.formData.companyImages)
            this.formData.companyImages = [];
          this.formData.companyImages.push(...fileIDs);
        }
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.showToast({
          title: "上传失败",
          icon: "none"
        });
      }
    },
    removeImage(index) {
      this.formData.companyImages.splice(index, 1);
    },
    async handleSubmit() {
      if (!this.formData.name) {
        common_vendor.index.showToast({
          title: this.userType === 1 ? "请输入姓名" : "请输入企业名称",
          icon: "none"
        });
        return;
      }
      if (this.formData.password && !this.formData.oldPassword) {
        common_vendor.index.showToast({
          title: "请输入原密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "保存中"
      });
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        const { result } = await common_vendor.er.callFunction({
          name: "userInformationCenter",
          data: {
            action: "updateProfile",
            data: {
              userId: userInfo.userId,
              ...this.formData
            }
          }
        });
        if (result.code === 0) {
          common_vendor.index.showToast({
            title: "保存成功"
          });
          const newUserInfo = {
            ...userInfo,
            ...this.formData
          };
          common_vendor.index.setStorageSync("userInfo", newUserInfo);
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: result.msg,
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "保存失败",
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
    a: $data.formData.avatar || "/static/default-avatar.png",
    b: common_vendor.o(($event) => $options.chooseImage("avatar")),
    c: $data.userType === 1
  }, $data.userType === 1 ? common_vendor.e({
    d: $data.formData.name,
    e: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    f: common_vendor.t($options.getGenderLabel($data.formData.gender)),
    g: $data.genderOptions,
    h: common_vendor.o((...args) => $options.handleGenderChange && $options.handleGenderChange(...args)),
    i: $data.formData.age,
    j: common_vendor.o(($event) => $data.formData.age = $event.detail.value),
    k: common_vendor.t($data.formData.education || "请选择学历"),
    l: $data.educationOptions,
    m: common_vendor.o((...args) => $options.handleEducationChange && $options.handleEducationChange(...args)),
    n: $data.skillInput,
    o: common_vendor.o(($event) => $data.skillInput = $event.detail.value),
    p: common_vendor.o((...args) => $options.addSkill && $options.addSkill(...args)),
    q: $data.formData.skills && $data.formData.skills.length > 0
  }, $data.formData.skills && $data.formData.skills.length > 0 ? {
    r: common_vendor.f($data.formData.skills, (skill, index, i0) => {
      return {
        a: common_vendor.t(skill),
        b: common_vendor.o(($event) => $options.removeSkill(index), index),
        c: index
      };
    })
  } : {}, {
    s: common_vendor.o((...args) => $options.addWorkExperience && $options.addWorkExperience(...args)),
    t: common_vendor.f($data.formData.workExperience, (exp, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.o(($event) => $options.removeWorkExperience(index), index),
        c: exp.company,
        d: common_vendor.o(($event) => exp.company = $event.detail.value, index),
        e: exp.position,
        f: common_vendor.o(($event) => exp.position = $event.detail.value, index),
        g: common_vendor.t(exp.startTime || "开始时间"),
        h: common_vendor.o((e) => $options.handleDateChange(e, index, "startTime"), index),
        i: common_vendor.t(exp.endTime || "结束时间"),
        j: common_vendor.o((e) => $options.handleDateChange(e, index, "endTime"), index),
        k: exp.description,
        l: common_vendor.o(($event) => exp.description = $event.detail.value, index),
        m: index
      };
    }),
    v: $data.formData.introduction,
    w: common_vendor.o(($event) => $data.formData.introduction = $event.detail.value)
  }) : common_vendor.e({
    x: $data.formData.name,
    y: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    z: $data.formData.registeredCapital,
    A: common_vendor.o(($event) => $data.formData.registeredCapital = $event.detail.value),
    B: common_vendor.t($data.formData.scale || "请选择企业规模"),
    C: $data.scaleOptions,
    D: common_vendor.o((...args) => $options.handleScaleChange && $options.handleScaleChange(...args)),
    E: $data.formData.companyDescription,
    F: common_vendor.o(($event) => $data.formData.companyDescription = $event.detail.value),
    G: common_vendor.f($data.formData.companyImages, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.removeImage(index), index),
        c: index
      };
    }),
    H: $data.formData.companyImages.length < 9
  }, $data.formData.companyImages.length < 9 ? {
    I: common_vendor.o(($event) => $options.chooseImage("company"))
  } : {}), {
    J: $data.formData.phone,
    K: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    L: $data.formData.oldPassword,
    M: common_vendor.o(($event) => $data.formData.oldPassword = $event.detail.value),
    N: $data.formData.password,
    O: common_vendor.o(($event) => $data.formData.password = $event.detail.value),
    P: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/edit.js.map
