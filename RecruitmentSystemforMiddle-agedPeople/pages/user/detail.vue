<!--
 * @description 求职者详情页面
 -->
<template>
	<view class="detail-container">
		<!-- 基本信息卡片 -->
		<view class="info-card">
			<view class="user-header">
				<text class="user-name">{{ userInfo.name }}</text>
				<text class="user-age" v-if="userInfo.age">{{ userInfo.age }}岁</text>
			</view>
			
			<view class="user-tags">
				<text class="tag" v-if="userInfo.education">{{ userInfo.education }}</text>
				<text class="tag" v-if="userInfo.experience">{{ userInfo.experience }}</text>
				<text class="tag" v-if="userInfo.location">{{ userInfo.location }}</text>
			</view>
			
			<view class="contact-info" v-if="userInfo.phone">
				<text class="section-title">联系方式</text>
				<text class="phone">{{ userInfo.phone }}</text>
			</view>
		</view>
		
		<!-- 求职意向 -->
		<view class="intention-card" v-if="userInfo.jobIntention">
			<text class="section-title">求职意向</text>
			<view class="intention-content">
				<view class="intention-item" v-if="userInfo.jobIntention.position">
					<text class="item-label">期望职位：</text>
					<text class="item-value">{{ userInfo.jobIntention.position }}</text>
				</view>
				<view class="intention-item" v-if="userInfo.jobIntention.salary">
					<text class="item-label">期望薪资：</text>
					<text class="item-value">{{ userInfo.jobIntention.salary }}</text>
				</view>
				<view class="intention-item" v-if="userInfo.jobIntention.location">
					<text class="item-label">期望地点：</text>
					<text class="item-value">{{ userInfo.jobIntention.location }}</text>
				</view>
				<view class="intention-item" v-if="userInfo.jobIntention.industry">
					<text class="item-label">期望行业：</text>
					<text class="item-value">{{ userInfo.jobIntention.industry }}</text>
				</view>
			</view>
		</view>
		
		<!-- 工作经历 -->
		<view class="experience-card" v-if="userInfo.workExperience && userInfo.workExperience.length">
			<text class="section-title">工作经历</text>
			<view 
				class="experience-item" 
				v-for="(exp, index) in userInfo.workExperience" 
				:key="index"
			>
				<view class="exp-header">
					<text class="company-name">{{ exp.company }}</text>
					<text class="exp-time">{{ exp.startTime }} - {{ exp.endTime }}</text>
				</view>
				<text class="position">{{ exp.position }}</text>
				<text class="exp-desc">{{ exp.description }}</text>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-bar" v-if="isEmployer">
			<button class="primary-btn" @click="handleInvite">发送面试邀请</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userId: '',
			userInfo: {},
			isEmployer: false
		}
	},
	onLoad(options) {
		this.userId = options.id
		this.loadUserInfo()
		this.checkUserRole()
	},
	methods: {
		async loadUserInfo() {
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'userInformationCenter',
					data: {
						action: 'getUserDetail',
						data: {
							userId: this.userId
						}
					}
				})
				
				if (result.result.code === 0) {
					this.userInfo = result.result.data
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
		
		async checkUserRole() {
			try {
				const result = await uniCloud.callFunction({
					name: 'userInformationCenter',
					data: {
						action: 'getCurrentUser'
					}
				})
				
				if (result.result.code === 0) {
					this.isEmployer = result.result.data.role === 'employer'
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		async handleInvite() {
			uni.showLoading({
				title: '处理中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'messageCenter',
					data: {
						action: 'sendInvitation',
						data: {
							userId: this.userId
						}
					}
				})
				
				if (result.result.code === 0) {
					uni.showToast({
						title: '邀请已发送',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: result.result.msg,
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '操作失败，请重试',
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
	padding: 30rpx;
}

.info-card, .intention-card, .experience-card {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.user-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-right: 20rpx;
}

.user-age {
	font-size: 28rpx;
	color: #666;
}

.user-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 30rpx;
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

.contact-info {
	border-top: 2rpx solid #f5f5f5;
	padding-top: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.phone {
	font-size: 28rpx;
	color: #666;
}

.intention-content {
	margin-top: 20rpx;
}

.intention-item {
	display: flex;
	margin-bottom: 16rpx;
}

.item-label {
	font-size: 28rpx;
	color: #666;
	width: 160rpx;
}

.item-value {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.experience-item {
	padding: 30rpx 0;
	border-bottom: 2rpx solid #f5f5f5;
}

.experience-item:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.exp-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.company-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.exp-time {
	font-size: 26rpx;
	color: #999;
}

.position {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 16rpx;
	display: block;
}

.exp-desc {
	font-size: 26rpx;
	color: #999;
	line-height: 1.6;
}

.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 20rpx 30rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.primary-btn {
	background-color: #007AFF;
	color: #fff;
	border-radius: 10rpx;
	font-size: 32rpx;
	padding: 20rpx 0;
	text-align: center;
	width: 100%;
}

.primary-btn:active {
	opacity: 0.8;
}
</style> 