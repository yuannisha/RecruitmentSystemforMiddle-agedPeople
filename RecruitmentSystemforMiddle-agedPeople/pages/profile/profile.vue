<!--
 * @description 个人中心页面
 -->
<template>
	<view class="profile-container">
		<!-- 未登录状态 -->
		<view class="login-tip" v-if="!userInfo">
			<text>请先登录</text>
			<button class="login-btn" @click="goToLogin">去登录</button>
		</view>
		
		<!-- 已登录状态 -->
		<block v-else>
			<!-- 用户信息卡片 -->
			<view class="user-card">
				<view class="user-info">
					<view class="avatar">
						<image v-if="userInfo.avatar" :src="userInfo.avatar" mode="aspectFill" class="avatar-image"></image>
						<text v-else class="avatar-text">{{ userInfo.name[0] }}</text>
					</view>
					<view class="info">
						<text class="name">{{ userInfo.name }}</text>
						<text class="type">{{ userInfo.userType === 1 ? '求职者' : '企业' }}</text>
					</view>
					<view class="edit-btn" @click="goToEdit">
						<text>编辑资料</text>
					</view>
				</view>
			</view>
			
			<!-- 功能菜单 -->
			<view class="menu-list">
				<!-- 求职者菜单 -->
				<block v-if="userInfo.userType === 1">
					<view class="menu-item" @click="goToApplicationList">
						<text class="menu-title">我的申请</text>
						<text class="menu-arrow">></text>
					</view>
					<view class="menu-item" @click="goToCollectionList">
						<text class="menu-title">我的收藏</text>
						<text class="menu-arrow">></text>
					</view>
				</block>
				
				<!-- 企业菜单 -->
				<block v-if="userInfo.userType === 2">
					<view class="menu-item" @click="goToPostJob">
						<text class="menu-title">发布职位</text>
						<text class="menu-arrow">></text>
					</view>
					<view class="menu-item" @click="goToApplicationList">
						<text class="menu-title">收到的申请</text>
						<text class="menu-arrow">></text>
					</view>
				</block>
				
				<!-- 通用菜单 -->
				<view class="menu-item" @click="goToMessageList">
					<text class="menu-title">消息中心</text>
					<text class="menu-arrow">></text>
				</view>
				
				<view class="menu-item" @click="handleLogout">
					<text class="menu-title logout">退出登录</text>
					<text class="menu-arrow">></text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo')
        console.log("userInfo",this.userInfo)
	},
	methods: {
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		
		goToApplicationList() {
			uni.navigateTo({
				url: '/pages/application/list'
			})
		},
		
		goToPostJob() {
			uni.navigateTo({
				url: '/pages/job/post'
			})
		},
		
		goToMessageList() {
			uni.switchTab({
				url: '/pages/message/list'
			})
		},
		
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除用户信息
						uni.removeStorageSync('userInfo')
						this.userInfo = null
						
						// 跳转到首页
						uni.switchTab({
							url: '/pages/index/index'
						})
					}
				}
			})
		},
		
		goToEdit() {
			uni.navigateTo({
				url: '/pages/profile/edit'
			})
		},
		
		goToCollectionList() {
			uni.navigateTo({
				url: '/pages/collection/list'
			})
		}
	}
}
</script>

<style>
.profile-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding: 30rpx;
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

.user-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
}

.user-info {
	display: flex;
	align-items: center;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	background-color: #007AFF;
	border-radius: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 30rpx;
}

.avatar-text {
	font-size: 48rpx;
	color: #fff;
	font-weight: bold;
}

.info {
	flex: 1;
}

.name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
	display: block;
}

.type {
	font-size: 28rpx;
	color: #666;
	background-color: #f5f5f5;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.menu-list {
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 40rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-title {
	font-size: 32rpx;
	color: #333;
}

.menu-title.logout {
	color: #ff4757;
}

.menu-arrow {
	font-size: 32rpx;
	color: #999;
}

.avatar-image {
	width: 100%;
	height: 100%;
	border-radius: 60rpx;
}

.edit-btn {
	padding: 10rpx 30rpx;
	background-color: #f5f5f5;
	border-radius: 30rpx;
	margin-left: auto;
}

.edit-btn text {
	font-size: 28rpx;
	color: #007AFF;
}
</style> 