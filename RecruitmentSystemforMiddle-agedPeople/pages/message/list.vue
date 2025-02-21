<!--
 * @description 消息中心页面
 -->
<template>
	<view class="message-container">
		<!-- 未登录状态 -->
		<view class="login-tip" v-if="!userInfo">
			<text>请先登录</text>
			<button class="login-btn" @click="goToLogin">去登录</button>
		</view>
		
		<!-- 已登录状态 -->
		<block v-else>
			<view class="message-list">
				<view 
					class="message-item"
					v-for="message in messageList"
					:key="message._id"
					@click="handleMessageClick(message)"
				>
					<view class="message-header">
						<text class="message-title">{{ message.title }}</text>
						<text class="message-time">{{ formatTime(message.createTime) }}</text>
					</view>
					
					<view class="message-content">{{ message.content }}</view>
					
					<view class="message-footer">
						<text class="message-type">{{ getTypeText(message.type) }}</text>
						<text class="unread-dot" v-if="!message.isRead"></text>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore" @click="loadMore">
				<text>加载更多</text>
			</view>
			<view class="no-more" v-else>
				<text>没有更多了</text>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="messageList.length === 0">
				<text>暂无消息</text>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null,
			page: 1,
			pageSize: 10,
			messageList: [],
			hasMore: true
		}
	},
	onShow() {
		console.log("onShow")
		this.userInfo = uni.getStorageSync('userInfo')
		if (this.userInfo) {
			this.resetList()
		}
	},
	methods: {
		resetList() {
			this.page = 1
			this.messageList = []
			this.hasMore = true
			this.loadMessageList()
		},
		
		async loadMessageList(loadMore = false) {
			if (!this.userInfo) return
			
			if (!loadMore) {
				this.page = 1
			}
			
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
				console.log("this.userInfo",this.userInfo)
				const result = await uniCloud.callFunction({
					name: 'messageCenter',
					data: {
						action: 'getMessageList',
						data: {
							userId: this.userInfo.userId,
							page: this.page,
							pageSize: this.pageSize
						}
					}
				})
				console.log("result",result)
				
				if (result.result.code === 0) {
					const { list, total } = result.result.data
					
					if (loadMore) {
						this.messageList = [...this.messageList, ...list]
					} else {
						this.messageList = list
					}
					
					this.hasMore = this.messageList.length < total
				} else {
					uni.showToast({
						title: result.result.msg,
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		},
		
		loadMore() {
			if (this.hasMore) {
				this.page++
				this.loadMessageList(true)
			}
		},
		
		async handleMessageClick(message) {
			if (!message.isRead) {
				try {
					await uniCloud.callFunction({
						name: 'messageCenter',
						data: {
							action: 'readMessage',
							data: {
								messageId: message._id
							}
						}
					})
					
					// 更新本地消息状态
					message.isRead = true
				} catch (e) {
					console.error('标记已读失败', e)
				}
			}
			
			// 如果是应聘通知，跳转到应聘记录页面
			if (message.type === 2) {
				uni.navigateTo({
					url: '/pages/application/list'
				})
			}
		},
		
		formatTime(timestamp) {
			const date = new Date(timestamp)
			const now = new Date()
			
			// 如果是今天的消息，只显示时间
			if (date.toDateString() === now.toDateString()) {
				return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			}
			
			// 如果是昨天的消息，显示"昨天"
			const yesterday = new Date(now)
			yesterday.setDate(now.getDate() - 1)
			if (date.toDateString() === yesterday.toDateString()) {
				return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			}
			
			// 其他日期显示完整日期
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		},
		
		getTypeText(type) {
			switch (type) {
				case 1:
					return '系统消息'
				case 2:
					return '应聘通知'
				case 4:
					return '面试邀请'
				case 5:
					return '来自企业的消息'	
				default:
					return '未知类型'
			}
		},
		
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	}
}
</script>

<style>
.message-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding: 20rpx;
}

/* 登录提示样式 */
.login-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
}

.login-tip text {
	font-size: 32rpx;
	color: #666;
	margin-bottom: 40rpx;
}

.login-btn {
	width: 240rpx;
	height: 80rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 40rpx;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.message-list {
	margin-bottom: 30rpx;
}

.message-item {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.message-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.message-time {
	font-size: 24rpx;
	color: #999;
}

.message-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 20rpx;
}

.message-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.message-type {
	font-size: 24rpx;
	color: #007AFF;
	background-color: rgba(0, 122, 255, 0.1);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.unread-dot {
	width: 16rpx;
	height: 16rpx;
	background-color: #ff4757;
	border-radius: 50%;
}

.load-more, .no-more {
	text-align: center;
	padding: 30rpx 0;
}

.load-more text, .no-more text {
	font-size: 26rpx;
	color: #999;
}

.empty-state {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 400rpx;
}

.empty-state text {
	font-size: 28rpx;
	color: #999;
}
</style> 