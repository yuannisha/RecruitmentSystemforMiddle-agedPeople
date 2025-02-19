<!--
 * @description 职位/公司列表页面
 -->
<template>
	<view class="list-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input 
				type="text" 
				v-model="keyword"
				:placeholder="userInfo?.userType === 1 ? '搜索公司' : '搜索职位'"
				@confirm="handleSearch"
			/>
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>
		
		<!-- 求职者视图：公司列表 -->
		<block v-if="userInfo?.userType === 1">
			<view class="company-list">
				<view 
					class="company-item" 
					v-for="company in companyList" 
					:key="company._id"
					@click="goToCompanyDetail(company._id)"
				>
					<view class="company-header">
						<text class="company-name">{{ company.name }}</text>
					</view>
					
					<view class="company-info">
						<text class="info-text">在招职位：{{ company.jobCount || 0 }}个</text>
					</view>
					
					<view class="company-tags">
						<text class="tag" v-if="company.industry">{{ company.industry }}</text>
						<text class="tag" v-if="company.scale">{{ company.scale }}</text>
						<text class="tag" v-if="company.location">{{ company.location }}</text>
					</view>
				</view>
			</view>
		</block>
		
		<!-- 企业视图：已发布职位列表 -->
		<block v-else-if="userInfo?.userType === 2">
			<view class="action-bar">
				<button class="post-btn" @click="goToPostJob">发布新职位</button>
			</view>
			
			<view class="job-list">
				<view 
					class="job-item" 
					v-for="job in jobList" 
					:key="job._id"
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
					
					<view class="job-stats">
						<text class="stats-text">应聘人数：{{ job.applicationCount || 0 }}</text>
					</view>
					
					<view class="job-actions">
						<button 
							class="action-btn view-btn"
							@click.stop="goToJobDetail(job._id)"
						>查看详情</button>
						<button 
							class="action-btn edit-btn"
							@click.stop="goToEditJob(job._id)"
						>编辑</button>
						<button 
							class="action-btn delete-btn"
							@click.stop="handleDeleteJob(job._id)"
						>删除</button>
					</view>
				</view>
			</view>
		</block>
		
		<!-- 未登录提示 -->
		<view class="login-tip" v-else>
			<text>请先登录</text>
			<button class="login-btn" @click="goToLogin">去登录</button>
		</view>
		
		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore" @click="loadMore">
			<text>加载更多</text>
		</view>
		<view class="no-more" v-else>
			<text>没有更多了</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null,
			keyword: '',
			page: 1,
			pageSize: 10,
			companyList: [],
			jobList: [],
			hasMore: true
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo')
		this.resetList()
	},
	onPullDownRefresh() {
		this.resetList()
	},
	methods: {
		resetList() {
			this.page = 1
			this.companyList = []
			this.jobList = []
			this.hasMore = true
			this.loadData()
		},
		
		handleSearch() {
			this.resetList()
		},
		
		async loadData(loadMore = false) {
			if (!this.userInfo) return
			
			if (!loadMore) {
				this.page = 1
			}
			
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
				if (this.userInfo.userType === 1) {
					// 求职者视图：加载公司列表
					await this.loadCompanyList(loadMore)
				} else {
					// 企业视图：加载已发布职位
					await this.loadMyJobList(loadMore)
				}
			} catch (e) {
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
				uni.stopPullDownRefresh()
			}
		},
		
		async loadCompanyList(loadMore) {
			const result = await uniCloud.callFunction({
				name: 'userInformationCenter',
				data: {
					action: 'getCompanyList',
					data: {
						keyword: this.keyword,
						page: this.page,
						pageSize: this.pageSize
					}
				}
			})
			
			if (result.result.code === 0) {
				const { list, total } = result.result.data
				
				if (loadMore) {
					this.companyList = [...this.companyList, ...list]
				} else {
					this.companyList = list
				}
				
				this.hasMore = this.companyList.length < total
			} else {
				uni.showToast({
					title: result.result.msg,
					icon: 'none'
				})
			}
		},
		
		async loadMyJobList(loadMore) {
			const result = await uniCloud.callFunction({
				name: 'jobCenter',
				data: {
					action: 'getMyJobList',
					data: {
						userId: this.userInfo.userId,
						keyword: this.keyword,
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
		},
		
		async handleDeleteJob(jobId) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该职位吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '删除中...'
						})
						
						try {
							const result = await uniCloud.callFunction({
								name: 'jobCenter',
								data: {
									action: 'deleteJob',
									data: {
										jobId
									}
								}
							})
							
							if (result.result.code === 0) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
								this.resetList()
							} else {
								uni.showToast({
									title: result.result.msg,
									icon: 'none'
								})
							}
						} catch (e) {
							uni.showToast({
								title: '删除失败，请重试',
								icon: 'none'
							})
						} finally {
							uni.hideLoading()
						}
					}
				}
			})
		},
		
		loadMore() {
			if (this.hasMore) {
				this.page++
				this.loadData(true)
			}
		},
		
		goToCompanyDetail(companyId) {
			uni.navigateTo({
				url: `/pages/company/detail?id=${companyId}`
			})
		},
		
		goToJobDetail(jobId) {
			uni.navigateTo({
				url: `/pages/job/detail?id=${jobId}`
			})
		},
		
		goToEditJob(jobId) {
			uni.navigateTo({
				url: `/pages/job/edit?id=${jobId}`
			})
		},
		
		goToPostJob() {
			uni.navigateTo({
				url: '/pages/job/post'
			})
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
.list-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding: 30rpx;
}

.search-bar {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.search-bar input {
	flex: 1;
	height: 80rpx;
	background-color: #fff;
	border-radius: 40rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	margin-right: 20rpx;
}

.search-btn {
	width: 120rpx;
	height: 80rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 40rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 公司列表样式 */
.company-list {
	margin-bottom: 30rpx;
}

.company-item {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.company-header {
	margin-bottom: 20rpx;
}

.company-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.company-info {
	margin-bottom: 20rpx;
}

.info-text {
	font-size: 28rpx;
	color: #666;
}

.company-tags {
	display: flex;
	flex-wrap: wrap;
}

/* 职位列表样式 */
.action-bar {
	margin-bottom: 30rpx;
}

.post-btn {
	width: 100%;
	height: 80rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 40rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.job-list {
	margin-bottom: 30rpx;
}

.job-item {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
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

.job-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20rpx;
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

.job-stats {
	margin-bottom: 20rpx;
}

.stats-text {
	font-size: 28rpx;
	color: #666;
}

.job-actions {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
}

.action-btn {
	padding: 10rpx 30rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
}

.view-btn {
	background-color: #007AFF;
	color: #fff;
}

.edit-btn {
	background-color: #ffa502;
	color: #fff;
}

.delete-btn {
	background-color: #ff4757;
	color: #fff;
}

/* 未登录提示 */
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

/* 加载更多 */
.load-more, .no-more {
	text-align: center;
	padding: 30rpx 0;
}

.load-more text, .no-more text {
	font-size: 26rpx;
	color: #999;
}
</style> 