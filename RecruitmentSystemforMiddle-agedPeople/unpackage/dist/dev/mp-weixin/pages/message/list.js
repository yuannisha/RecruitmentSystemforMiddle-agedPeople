"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null,
      page: 1,
      pageSize: 10,
      messageList: [],
      hasMore: true
    };
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/message/list.vue:63", "onShow");
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
    if (this.userInfo) {
      this.resetList();
    }
  },
  methods: {
    resetList() {
      this.page = 1;
      this.messageList = [];
      this.hasMore = true;
      this.loadMessageList();
    },
    async loadMessageList(loadMore = false) {
      if (!this.userInfo)
        return;
      if (!loadMore) {
        this.page = 1;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        common_vendor.index.__f__("log", "at pages/message/list.vue:89", "this.userInfo", this.userInfo);
        const result = await common_vendor.er.callFunction({
          name: "messageCenter",
          data: {
            action: "getMessageList",
            data: {
              userId: this.userInfo.userId,
              page: this.page,
              pageSize: this.pageSize
            }
          }
        });
        common_vendor.index.__f__("log", "at pages/message/list.vue:101", "result", result);
        if (result.result.code === 0) {
          const { list, total } = result.result.data;
          if (loadMore) {
            this.messageList = [...this.messageList, ...list];
          } else {
            this.messageList = list;
          }
          this.hasMore = this.messageList.length < total;
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
        this.loadMessageList(true);
      }
    },
    async handleMessageClick(message) {
      if (!message.isRead) {
        try {
          await common_vendor.er.callFunction({
            name: "messageCenter",
            data: {
              action: "readMessage",
              data: {
                messageId: message._id
              }
            }
          });
          message.isRead = true;
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/message/list.vue:152", "标记已读失败", e);
        }
      }
      if (message.type === 2) {
        common_vendor.index.navigateTo({
          url: "/pages/application/list"
        });
      }
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
    },
    getTypeText(type) {
      switch (type) {
        case 1:
          return "系统消息";
        case 2:
          return "应聘通知";
        case 4:
          return "面试邀请";
        case 5:
          return "来自企业的消息";
        default:
          return "未知类型";
      }
    },
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.userInfo
  }, !$data.userInfo ? {
    b: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  } : common_vendor.e({
    c: common_vendor.f($data.messageList, (message, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(message.title),
        b: common_vendor.t($options.formatTime(message.createTime)),
        c: common_vendor.t(message.content),
        d: common_vendor.t($options.getTypeText(message.type)),
        e: !message.isRead
      }, !message.isRead ? {} : {}, {
        f: message._id,
        g: common_vendor.o(($event) => $options.handleMessageClick(message), message._id)
      });
    }),
    d: $data.hasMore
  }, $data.hasMore ? {
    e: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    f: $data.messageList.length === 0
  }, $data.messageList.length === 0 ? {} : {}));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/list.js.map
