<!--
 * @description 收藏列表页面
 -->
<template>
	<view class="collection-container">
		<!-- 未登录状态 -->
		<view class="login-tip" v-if="!userInfo">
			<text>请先登录</text>
			<button class="login-btn" @click="goToLogin">去登录</button>
		</view>
		
		<!-- 已登录状态 -->
		<block v-else>
			<view class="job-list">
				<view 
					class="job-item"
					v-for="job in jobList"
					:key="job._id"
					@click="goToJobDetail(job._id)"
				>
					<view class="job-header">
						<text class="job-title">{{ job.title }}</text>
						<text class="job-salary">{{ job.salary }}</text>
					</view>
					
					<view class="company-info">
						<text class="company-name">{{ job.companyName }}</text>
						<text class="job-location">{{ job.location }}</text>
					</view>
					
					<view class="job-tags">
						<text class="tag" v-for="(tag, index) in job.tags" :key="index">{{ tag }}</text>
					</view>
					
					<view class="job-footer">
						<text class="collect-time">收藏于 {{ formatTime(job.createTime) }}</text>
						<button class="cancel-btn" @click.stop="handleCancelCollect(job._id)">取消收藏</button>
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
			<view class="empty-state" v-if="jobList.length === 0">
				<text>暂无收藏</text>
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
			jobList: [],
			hasMore: true
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo')
		if (this.userInfo) {
			this.resetList()
		}
	},
	methods: {
		resetList() {
			this.page = 1
			this.jobList = []
			this.hasMore = true
			this.loadCollectionList()
		},
		
		async loadCollectionList(loadMore = false) {
			if (!this.userInfo) return
			
			if (!loadMore) {
				this.page = 1
			}
			
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'getCollectionList',
						data: {
							userId: this.userInfo.userId,
							page: this.page,
							pageSize: this.pageSize
						}
					}
				})
				
				if (result.result.code === 0) {
					const { list, total } = result.result.data
					
					if (loadMore) {
						this.jobList = [...this.jobList, ...list]
					} else {
						this.jobList = list
					}
					
					this.hasMore = this.jobList.length < total
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
				this.loadCollectionList(true)
			}
		},
		
		async handleCancelCollect(jobId) {
			uni.showModal({
				title: '提示',
				content: '确定要取消收藏吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '处理中...'
						})
						
						try {
							const result = await uniCloud.callFunction({
								name: 'jobCenter',
								data: {
									action: 'cancelCollect',
									data: {
										userId: this.userInfo.userId,
										jobId
									}
								}
							})
							
							if (result.result.code === 0) {
								uni.showToast({
									title: '已取消收藏'
								})
								// 更新列表
								this.jobList = this.jobList.filter(job => job._id !== jobId)
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
			})
		},
		
		goToJobDetail(jobId) {
			uni.navigateTo({
				url: `/pages/job/detail?id=${jobId}`
			})
		},
		
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		
		formatTime(timestamp) {
			const date = new Date(timestamp)
			const now = new Date()
			
			// 如果是今天，只显示时间
			if (date.toDateString() === now.toDateString()) {
				return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			}
			
			// 如果是昨天，显示"昨天"
			const yesterday = new Date(now)
			yesterday.setDate(now.getDate() - 1)
			if (date.toDateString() === yesterday.toDateString()) {
				return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			}
			
			// 其他日期显示完整日期
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		}
	}
}
</script>

<style>
.collection-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding: 20rpx;
}

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

.job-list {
	margin-bottom: 30rpx;
}

.job-item {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.job-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.job-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.job-salary {
	font-size: 32rpx;
	color: #ff6b81;
	font-weight: bold;
}

.company-info {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.company-name {
	font-size: 28rpx;
	color: #666;
	margin-right: 20rpx;
}

.job-location {
	font-size: 24rpx;
	color: #999;
}

.job-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20rpx;
}

.tag {
	font-size: 24rpx;
	color: #007AFF;
	background-color: rgba(0, 122, 255, 0.1);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	margin-right: 16rpx;
	margin-bottom: 16rpx;
}

.job-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.collect-time {
	font-size: 24rpx;
	color: #999;
}

.cancel-btn {
	font-size: 24rpx;
	color: #666;
	background-color: #f5f5f5;
	padding: 8rpx 24rpx;
	border-radius: 24rpx;
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