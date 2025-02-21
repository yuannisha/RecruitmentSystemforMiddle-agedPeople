<!--
 * @description 职位详情页面
 -->
<template>
	<view class="detail-container">
		<!-- 职位信息卡片 -->
		<view class="job-card">
			<view class="job-header">
				<text class="job-title">{{ jobInfo.title }}</text>
				<text class="job-salary">{{ jobInfo.salary }}</text>
			</view>
			
			<view class="company-info">
				<text class="company-name">{{ jobInfo.companyName }}</text>
				<text class="job-location">{{ jobInfo.location }}</text>
			</view>
			
			<view class="job-tags">
				<text class="tag" v-if="jobInfo.experience">{{ jobInfo.experience }}</text>
				<text class="tag" v-if="jobInfo.education">{{ jobInfo.education }}</text>
				<text class="tag" v-if="jobInfo.address">{{ jobInfo.address }}</text>
			</view>
		</view>
		
		<!-- 公司信息卡片 -->
		<view class="section-card company-card">
			<view class="section-header">
				<text class="section-title">公司信息</text>
			</view>
			<view class="company-detail">
				<view class="company-basic">
					<text class="company-scale" v-if="jobInfo.companyInfo.scale">规模：{{ jobInfo.companyInfo.scale }}</text>
					<text class="company-capital" v-if="jobInfo.companyInfo.registeredCapital">注册资金：{{ jobInfo.companyInfo.registeredCapital }}</text>
				</view>
				<view class="company-desc" v-if="jobInfo.companyInfo.companyDescription">
					<text class="desc-title">公司介绍</text>
					<text class="desc-content">{{ jobInfo.companyInfo.companyDescription }}</text>
				</view>
				<view class="company-images" v-if="jobInfo.companyInfo.companyImages && jobInfo.companyInfo.companyImages.length">
					<image 
						v-for="(image, index) in jobInfo.companyInfo.companyImages" 
						:key="index"
						:src="image"
						mode="aspectFill"
						class="company-image"
					></image>
				</view>
			</view>
		</view>
		
		<!-- 职位描述 -->
		<view class="section-card">
			<view class="section-header">
				<text class="section-title">职位描述</text>
			</view>
			<view class="section-content">
				<text class="content-text">{{ jobInfo.description }}</text>
			</view>
		</view>
		
		<!-- 任职要求 -->
		<view class="section-card">
			<view class="section-header">
				<text class="section-title">任职要求</text>
			</view>
			<view class="section-content">
				<text class="content-text">{{ jobInfo.requirement }}</text>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-bar">
			<button 
				class="collect-btn" 
				:class="{ 'collected': isCollected }"
				@click="handleCollect"
			>
				<text class="btn-icon">{{ isCollected ? '★' : '☆' }}</text>
				<text>{{ isCollected ? '已收藏' : '收藏' }}</text>
			</button>
			<button class="apply-btn" @click="handleApply">立即申请</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			jobId: '',
			jobInfo: {},
			userInfo: null,
			isCollected: false
		}
	},
	onLoad(options) {
		this.jobId = options.id
		this.userInfo = uni.getStorageSync('userInfo')
		this.loadJobInfo()
		if (this.userInfo) {
			this.checkCollected()
		}
	},
	methods: {
		async loadJobInfo() {
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
				console.log("result",result)
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
		
		async checkCollected() {
			try {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'checkCollected',
						data: {
							userId: this.userInfo.userId,
							jobId: this.jobId
						}
					}
				})
				
				if (result.result.code === 0) {
					this.isCollected = result.result.data.collected
				}
			} catch (e) {
				console.error('检查收藏状态失败', e)
			}
		},
		
		async handleCollect() {
			if (!this.userInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			
			uni.showLoading({
				title: '处理中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: this.isCollected ? 'cancelCollect' : 'collectJob',
						data: {
							userId: this.userInfo.userId,
							jobId: this.jobId
						}
					}
				})
				
				if (result.result.code === 0) {
					this.isCollected = !this.isCollected
					uni.showToast({
						title: this.isCollected ? '收藏成功' : '已取消收藏'
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
		
		async handleApply() {
			if (!this.userInfo) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			
			uni.showLoading({
				title: '处理中...'
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
						title: '申请成功'
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
	padding: 20rpx;
	padding-bottom: 120rpx;
}

.job-card, .section-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.job-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.job-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.job-salary {
	font-size: 36rpx;
	color: #ff6b81;
	font-weight: bold;
}

.company-info {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.company-name {
	font-size: 30rpx;
	color: #666;
	margin-right: 20rpx;
	font-weight: 500;
}

.job-location {
	font-size: 28rpx;
	color: #999;
}

.job-tags {
	display: flex;
	flex-wrap: wrap;
}

.tag {
	font-size: 24rpx;
	color: #007AFF;
	background-color: rgba(0, 122, 255, 0.1);
	padding: 8rpx 24rpx;
	border-radius: 24rpx;
	margin-right: 16rpx;
	margin-bottom: 16rpx;
}

.section-header {
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	position: relative;
	padding-left: 20rpx;
}

.section-title::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 6rpx;
	height: 24rpx;
	background-color: #007AFF;
	border-radius: 3rpx;
}

.section-content {
	padding: 10rpx;
}

.content-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.8;
	white-space: pre-wrap;
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

.collect-btn, .apply-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.collect-btn {
	background-color: #f5f5f5;
	color: #333;
}

.collect-btn.collected {
	background-color: #fff0f5;
	color: #ff6b81;
}

.btn-icon {
	margin-right: 8rpx;
	font-size: 32rpx;
}

.apply-btn {
	background-color: #007AFF;
	color: #fff;
}

/* 公司信息卡片样式 */
.company-card {
	margin-bottom: 20rpx;
}

.company-detail {
	padding: 10rpx;
}

.company-basic {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.company-scale,
.company-capital {
	font-size: 28rpx;
	color: #666;
	background-color: #f8f8f8;
	padding: 8rpx 24rpx;
	border-radius: 24rpx;
}

.company-desc {
	margin-top: 20rpx;
}

.desc-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 10rpx;
	display: block;
}

.desc-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	display: block;
}

.company-images {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-top: 20rpx;
}

.company-image {
	width: 220rpx;
	height: 220rpx;
	border-radius: 12rpx;
}
</style> 