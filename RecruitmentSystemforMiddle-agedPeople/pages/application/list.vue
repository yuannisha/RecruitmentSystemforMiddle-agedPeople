<!--
 * @description 应聘记录页面
 -->
<template>
	<view class="list-container">
		<view class="tab-bar">
			<view 
				class="tab-item" 
				:class="{ active: status === 1 }"
				@click="handleTabChange(1)"
			>
				待处理
			</view>
			<view 
				class="tab-item" 
				:class="{ active: status === 2 }"
				@click="handleTabChange(2)"
			>
				已通过
			</view>
			<view 
				class="tab-item" 
				:class="{ active: status === 3 }"
				@click="handleTabChange(3)"
			>
				已拒绝
			</view>
		</view>
		
		<view class="application-list">
			<view 
				class="application-item"
				v-for="item in applicationList"
				:key="item._id"
			>
				<view class="job-info">
					<text class="job-title">{{ item.jobInfo[0].title }}</text>
					<text class="job-salary">{{ item.jobInfo[0].salary }}</text>
				</view>
				
				<view class="company-info" v-if="this.userInfo.userType === 1">
					<text class="company-name">{{ item.jobInfo[0].companyName }}</text>
				</view>
				
				<view class="applicant-info" v-if="this.userInfo.userType === 2">
					<text class="applicant-name">申请人：{{ item.userInfo[0].name }}</text>
					<text class="apply-time">申请时间：{{ formatTime(item.createTime) }}</text>
				</view>
				
				<view class="status-bar">
					<text class="status-text" :class="'status-' + item.status">
						{{ getStatusText(item.status) }}
					</text>
					
					<view class="action-btns" v-if="this.userInfo.userType === 2 && item.status === 1">
						<button 
							class="btn btn-primary"
							@click="handleApplication(item._id, 2)"
						>通过</button>
						<button 
							class="btn btn-danger"
							@click="handleApplication(item._id, 3)"
						>拒绝</button>
					</view>
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null,
			status: 1,
			page: 1,
			pageSize: 10,
			applicationList: [],
			hasMore: true
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo')
        console.log("userInfo   ",this.userInfo)
        console.log("uni.getStorageSync('userInfo')",uni.getStorageSync('userInfo'))
		this.resetList()
	},
	methods: {
		handleTabChange(status) {
			this.status = status
			this.resetList()
		},
		
		resetList() {
			this.page = 1
			this.applicationList = []
			this.hasMore = true
			this.loadApplicationList()
		},
		
		async loadApplicationList(loadMore = false) {
			if (!loadMore) {
				this.page = 1
			}
			
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
                console.log("this.userInfo.userId",this.userInfo)
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'getApplicationList',
						data: {
							userId: this.userInfo.userId,
							userType: this.userInfo.userType,
							status: this.status,
							page: this.page,
							pageSize: this.pageSize
						}
					}
				})
				
				if (result.result.code === 0) {
					const { list, total } = result.result.data
					
					if (loadMore) {
						this.applicationList = [...this.applicationList, ...list]
					} else {
						this.applicationList = list
					}
					
					this.hasMore = this.applicationList.length < total
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
				this.loadApplicationList(true)
			}
		},
		
		async handleApplication(applicationId, status) {
			uni.showLoading({
				title: '处理中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'handleApplication',
						data: {
							applicationId,
							status
						}
					}
				})
				
				if (result.result.code === 0) {
					uni.showToast({
						title: '操作成功',
						icon: 'success'
					})
					
					// 刷新列表
					this.resetList()
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
		
		formatTime(timestamp) {
			const date = new Date(timestamp)
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		},
		
		getStatusText(status) {
			switch (status) {
				case 1:
					return '待处理'
				case 2:
					return '已通过'
				case 3:
					return '已拒绝'
				default:
					return '未知状态'
			}
		}
	}
}
</script>

<style>
.list-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding-bottom: 30rpx;
}

.tab-bar {
	display: flex;
	background-color: #fff;
	padding: 20rpx 30rpx;
	margin-bottom: 20rpx;
}

.tab-item {
	flex: 1;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	padding: 20rpx 0;
	position: relative;
}

.tab-item.active {
	color: #007AFF;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 40rpx;
	height: 4rpx;
	background-color: #007AFF;
	border-radius: 2rpx;
}

.application-list {
	padding: 0 20rpx;
}

.application-item {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.job-info {
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

.company-info, .applicant-info {
	margin-bottom: 20rpx;
}

.company-name, .applicant-name {
	font-size: 28rpx;
	color: #666;
}

.apply-time {
	font-size: 24rpx;
	color: #999;
	margin-left: 20rpx;
}

.status-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.status-text {
	font-size: 26rpx;
}

.status-1 {
	color: #ffa502;
}

.status-2 {
	color: #2ed573;
}

.status-3 {
	color: #ff4757;
}

.action-btns {
	display: flex;
	gap: 20rpx;
}

.btn {
	padding: 10rpx 30rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
}

.btn-primary {
	background-color: #007AFF;
	color: #fff;
}

.btn-danger {
	background-color: #ff4757;
	color: #fff;
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