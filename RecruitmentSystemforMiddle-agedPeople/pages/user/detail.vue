<!--
 * @description 求职者详情页面
 -->
<template>
	<view class="detail-container">
		<!-- 基本信息卡片 -->
		<view class="info-card">
			<view class="user-header">
				<view class="avatar-section">
					<image v-if="userInfo.avatar" :src="userInfo.avatar" mode="aspectFill" class="avatar"></image>
					<view v-else class="avatar-placeholder">{{ userInfo.name[0] }}</view>
				</view>
				<view class="basic-info">
					<view class="name-age">
						<text class="user-name">{{ userInfo.name }}</text>
						<text class="user-age" v-if="userInfo.age">{{ userInfo.age }}岁</text>
						<text class="gender" v-if="userInfo.gender">{{ userInfo.gender === 1 ? '男' : '女' }}</text>
					</view>
					<view class="user-tags">
						<text class="tag" v-if="userInfo.education">{{ userInfo.education }}</text>
						<text class="tag" v-if="userInfo.workExperience && userInfo.workExperience.length">{{ userInfo.workExperience.length }}段工作经历</text>
					</view>
				</view>
			</view>
			
			<view class="contact-info" v-if="userInfo.phone">
				<text class="section-title">联系方式</text>
				<text class="phone">{{ userInfo.phone }}</text>
			</view>
		</view>
		
		<!-- 技能标签 -->
		<view class="skills-card" v-if="userInfo.skills && userInfo.skills.length">
			<text class="section-title">技能特长</text>
			<view class="skills-list">
				<text class="skill-tag" v-for="(skill, index) in userInfo.skills" :key="index">{{ skill }}</text>
			</view>
		</view>
		
		<!-- 自我介绍 -->
		<view class="intro-card" v-if="userInfo.introduction">
			<text class="section-title">自我介绍</text>
			<text class="intro-text">{{ userInfo.introduction }}</text>
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
			<button class="secondary-btn" @click="handleMessage">发送消息</button>
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
				console.log("uni.getStorageSync('userInfo')",uni.getStorageSync('userInfo'))
				const result = await uniCloud.callFunction({
					name: 'userInformationCenter',
					data: {
						action: 'getCurrentUser',
						data: {
							userInfo: uni.getStorageSync('userInfo')
						}
					}
				})
				console.log("result",result)
				
				if (result.result.code === 0) {
					this.isEmployer = result.result.data.userType === 2
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
							userId: this.userId,
							companyId: uni.getStorageSync('userInfo').userId
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
		},
		
		async handleMessage() {
			uni.showLoading({
				title: '处理中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'messageCenter',
					data: {
						action: 'sendMessage',
						data: {
							receiverId: this.userId,
							senderId: uni.getStorageSync('userInfo').userId,
							type: 5,
							title: '来自企业的消息',
							isRead: false,
							content: `您好，我是来自${uni.getStorageSync('userInfo').name}的HR，我对您的简历很感兴趣，想进一步了解一下,请您联系我，我的联系方式是：${uni.getStorageSync('userInfo').phone}。`
						}
					}
				})
				
				if (result.result.code === 0) {
					uni.showToast({
						title: '消息已发送',
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

.info-card, .skills-card, .intro-card, .experience-card {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.user-header {
	display: flex;
	margin-bottom: 30rpx;
}

.avatar-section {
	margin-right: 30rpx;
}

.avatar, .avatar-placeholder {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
}

.avatar-placeholder {
	background-color: #007AFF;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48rpx;
}

.basic-info {
	flex: 1;
}

.name-age {
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

.user-age, .gender {
	font-size: 28rpx;
	color: #666;
	margin-right: 20rpx;
}

.user-tags {
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

.skills-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.skill-tag {
	font-size: 26rpx;
	color: #007AFF;
	background-color: rgba(0, 122, 255, 0.1);
	padding: 10rpx 30rpx;
	border-radius: 30rpx;
}

.intro-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
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
	margin-bottom: 20rpx;
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
	padding: 20rpx 30rpx;
	background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	display: flex;
	gap: 30rpx;
}

.primary-btn, .secondary-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.primary-btn {
	background-color: #007AFF;
	color: #fff;
}

.secondary-btn {
	background-color: #f5f5f5;
	color: #333;
}
</style> 