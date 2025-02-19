<!--
 * @description 职位详情页
 -->
<template>
	<view class="detail-container">
		<view class="job-card">
			<view class="job-header">
				<text class="job-title">{{ jobInfo.title }}</text>
				<text class="job-salary">{{ jobInfo.salary }}</text>
			</view>
			
			<view class="job-company">
				<text class="company-name">{{ jobInfo.companyName }}</text>
			</view>
			
			<view class="job-tags">
				<text class="tag" v-if="jobInfo.experience">{{ jobInfo.experience }}</text>
				<text class="tag" v-if="jobInfo.education">{{ jobInfo.education }}</text>
				<text class="tag" v-if="jobInfo.location">{{ jobInfo.location }}</text>
			</view>
		</view>
		
		<view class="job-detail">
			<view class="section">
				<view class="section-title">职位描述</view>
				<view class="section-content">{{ jobInfo.description }}</view>
			</view>
			
			<view class="section">
				<view class="section-title">任职要求</view>
				<view class="section-content">{{ jobInfo.requirement }}</view>
			</view>
			
			<view class="section">
				<view class="section-title">工作地址</view>
				<view class="section-content">{{ jobInfo.address }}</view>
			</view>
		</view>
		
		<!-- 申请按钮（仅求职者可见） -->
		<view class="action-bar" v-if="userInfo && userInfo.userType === 1">
			<button class="apply-btn" @click="handleApply">申请职位</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			jobId: '',
			jobInfo: {},
			userInfo: null
		}
	},
	onLoad(options) {
		this.jobId = options.id
		this.userInfo = uni.getStorageSync('userInfo')
		this.loadJobDetail()
	},
	methods: {
		async loadJobDetail() {
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'getJobDetail',
						data: {
							jobId: this.jobId
						}
					}
				})
				
				if (result.result.code === 0) {
					this.jobInfo = result.result.data
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
		
		async handleApply() {
			if (!this.userInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			
			uni.showLoading({
				title: '申请中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'apply',
						data: {
							userId: this.userInfo.userId,
							jobId: this.jobId
						}
					}
				})
				
				if (result.result.code === 0) {
					uni.showToast({
						title: '申请成功',
						icon: 'success'
					})
					
					// 发送消息给企业
					await uniCloud.callFunction({
						name: 'messageCenter',
						data: {
							action: 'sendMessage',
							data: {
								senderId: this.userInfo.userId,
								receiverId: this.jobInfo.companyId,
								type: 2,
								title: '新的职位申请',
								content: `${this.userInfo.name}申请了职位：${this.jobInfo.title}`
							}
						}
					})
				} else {
					uni.showToast({
						title: result.result.msg,
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '申请失败，请重试',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		}
	}
}
</script>

<style>
.detail-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding-bottom: 120rpx;
}

.job-card {
	background-color: #fff;
	padding: 40rpx;
}

.job-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.job-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.job-salary {
	font-size: 36rpx;
	color: #ff6b6b;
	font-weight: bold;
}

.job-company {
	margin-bottom: 30rpx;
}

.company-name {
	font-size: 32rpx;
	color: #666;
}

.job-tags {
	display: flex;
	flex-wrap: wrap;
}

.tag {
	font-size: 24rpx;
	color: #666;
	background-color: #f5f5f5;
	padding: 8rpx 20rpx;
	border-radius: 24rpx;
	margin-right: 16rpx;
	margin-bottom: 16rpx;
}

.job-detail {
	margin-top: 20rpx;
	background-color: #fff;
	padding: 40rpx;
}

.section {
	margin-bottom: 40rpx;
}

.section:last-child {
	margin-bottom: 0;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.section-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.action-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #fff;
	padding: 20rpx 40rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.apply-btn {
	width: 100%;
	height: 80rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 40rpx;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style> 