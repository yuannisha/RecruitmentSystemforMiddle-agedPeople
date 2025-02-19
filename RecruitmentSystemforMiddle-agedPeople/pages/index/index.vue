<!--
 * @description 首页
 -->
<template>
	<view class="index-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input 
				type="text" 
				v-model="keyword"
				:placeholder="userInfo?.userType === 1 ? '搜索职位' : '搜索求职者'"
				@confirm="handleSearch"
			/>
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>
		
		<!-- 求职者视图：职位列表 -->
		<block v-if="userInfo?.userType === 1">
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
					
					<view class="job-company">
						<text class="company-name">{{ job.companyName }}</text>
					</view>
					
					<view class="job-tags">
						<text class="tag" v-if="job.experience">{{ job.experience }}</text>
						<text class="tag" v-if="job.education">{{ job.education }}</text>
						<text class="tag" v-if="job.location">{{ job.location }}</text>
					</view>
					
					<view class="job-desc">{{ job.description }}</view>
				</view>
			</view>
		</block>
		
		<!-- 企业视图：求职者列表 -->
		<block v-else-if="userInfo?.userType === 2">
			<view class="user-list">
				<view 
					class="user-item" 
					v-for="user in userList" 
					:key="user._id"
					@click="goToUserDetail(user._id)"
				>
					<view class="user-header">
						<view class="user-info">
							<text class="user-name">{{ user.name }}</text>
							<text class="user-age" v-if="user.age">{{ user.age }}岁</text>
						</view>
					</view>
					
					<view class="user-tags">
						<text class="tag" v-if="user.experience">{{ user.experience }}</text>
						<text class="tag" v-if="user.education">{{ user.education }}</text>
						<text class="tag" v-if="user.location">{{ user.location }}</text>
					</view>
					
					<view class="user-intention">
						<text class="intention-label">求职意向：</text>
						<text class="intention-value">{{ user.jobIntention || '暂无' }}</text>
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
				jobList: [],
				userList: [],
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
				this.jobList = []
				this.userList = []
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
						// 求职者视图：加载职位列表
						await this.loadJobList(loadMore)
					} else {
						// 企业视图：加载求职者列表
						await this.loadUserList(loadMore)
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
			
			async loadJobList(loadMore) {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'getJobList',
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
			
			async loadUserList(loadMore) {
				const result = await uniCloud.callFunction({
					name: 'userInformationCenter',
					data: {
						action: 'getUserList',
						data: {
							keyword: this.keyword,
							userType: 1, // 只查询求职者
							page: this.page,
							pageSize: this.pageSize
						}
					}
				})
				
				if (result.result.code === 0) {
					const { list, total } = result.result.data
					
					if (loadMore) {
						this.userList = [...this.userList, ...list]
					} else {
						this.userList = list
					}
					
					this.hasMore = this.userList.length < total
				} else {
					uni.showToast({
						title: result.result.msg,
						icon: 'none'
					})
				}
			},
			
			loadMore() {
				if (this.hasMore) {
					this.page++
					this.loadData(true)
				}
			},
			
			goToJobDetail(jobId) {
				uni.navigateTo({
					url: `/pages/job/detail?id=${jobId}`
				})
			},
			
			goToUserDetail(userId) {
				uni.navigateTo({
					url: `/pages/user/detail?id=${userId}`
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
	.index-container {
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

	/* 职位列表样式 */
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

	.job-company {
		margin-bottom: 20rpx;
	}

	.company-name {
		font-size: 28rpx;
		color: #666;
	}

	/* 求职者列表样式 */
	.user-list {
		margin-bottom: 30rpx;
	}

	.user-item {
		background-color: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.user-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.user-name {
		font-size: 32rpx;
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

	.user-intention {
		font-size: 28rpx;
		color: #666;
	}

	.intention-label {
		color: #999;
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
