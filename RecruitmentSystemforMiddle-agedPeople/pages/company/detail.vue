<!--
 * @description 公司详情页面
 -->
<template>
	<view class="detail-container">
		<!-- 公司信息卡片 -->
		<view class="company-card">
			<view class="company-header">
				<text class="company-name">{{ companyInfo.name }}</text>
			</view>
			
			<view class="company-tags">
				<text class="tag" v-if="companyInfo.industry">{{ companyInfo.industry }}</text>
				<text class="tag" v-if="companyInfo.scale">{{ companyInfo.scale }}</text>
				<text class="tag" v-if="companyInfo.location">{{ companyInfo.location }}</text>
			</view>
			
			<view class="company-desc" v-if="companyInfo.description">
				<text class="section-title">公司简介</text>
				<text class="desc-text">{{ companyInfo.description }}</text>
			</view>
		</view>
		
		<!-- 在招职位 -->
		<view class="job-section">
			<view class="section-header">
				<text class="section-title">在招职位</text>
				<text class="job-count">({{ jobList.length }}个)</text>
			</view>
			
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
					
					<view class="job-tags">
						<text class="tag" v-if="job.experience">{{ job.experience }}</text>
						<text class="tag" v-if="job.education">{{ job.education }}</text>
						<text class="tag" v-if="job.location">{{ job.location }}</text>
					</view>
					
					<view class="job-desc">{{ job.description }}</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore" @click="loadMore">
				<text>加载更多</text>
			</view>
			<view class="no-more" v-else>
				<text>没有更多了</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyId: '',
			companyInfo: {},
			page: 1,
			pageSize: 10,
			jobList: [],
			hasMore: true
		}
	},
	onLoad(options) {
		this.companyId = options.id
		this.loadCompanyInfo()
		this.loadJobList()
	},
	onPullDownRefresh() {
		this.resetList()
	},
	methods: {
		resetList() {
			this.page = 1
			this.jobList = []
			this.hasMore = true
			Promise.all([
				this.loadCompanyInfo(),
				this.loadJobList()
			]).finally(() => {
				uni.stopPullDownRefresh()
			})
		},
		
		async loadCompanyInfo() {
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'userInformationCenter',
					data: {
						action: 'getCompanyInfo',
						data: {
							companyId: this.companyId
						}
					}
				})
				
				if (result.result.code === 0) {
					this.companyInfo = result.result.data
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
		
		async loadJobList(loadMore = false) {
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
						action: 'getCompanyJobList',
						data: {
							companyId: this.companyId,
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
				this.loadJobList(true)
			}
		},
		
		goToJobDetail(jobId) {
			uni.navigateTo({
				url: `/pages/job/detail?id=${jobId}`
			})
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

.company-card {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.company-header {
	margin-bottom: 20rpx;
}

.company-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.company-tags {
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

.company-desc {
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

.desc-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.job-section {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.job-count {
	font-size: 28rpx;
	color: #666;
	margin-left: 10rpx;
}

.job-list {
	margin-bottom: 30rpx;
}

.job-item {
	padding: 30rpx;
	border-radius: 20rpx;
	background-color: #f8f8f8;
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
	color: #ff6b6b;
	font-weight: bold;
}

.job-desc {
	font-size: 26rpx;
	color: #999;
	line-height: 1.6;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.load-more, .no-more {
	text-align: center;
	padding: 30rpx 0;
}

.load-more text, .no-more text {
	font-size: 26rpx;
	color: #999;
}
</style> 