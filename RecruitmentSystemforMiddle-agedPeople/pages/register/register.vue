<!--
 * @description 注册页面
 -->
<template>
	<view class="register-container">
		<view class="register-header">
			<text class="register-title">用户注册</text>
			<text class="register-subtitle">请选择注册类型并填写信息</text>
		</view>
		
		<view class="register-form">
			<view class="user-type">
				<view 
					class="type-item" 
					:class="{ active: userType === 1 }"
					@click="userType = 1"
				>
					<text>我是求职者</text>
				</view>
				<view 
					class="type-item" 
					:class="{ active: userType === 2 }"
					@click="userType = 2"
				>
					<text>我是企业</text>
				</view>
			</view>
			
			<view class="form-item">
				<input type="text" v-model="phone" placeholder="请输入手机号" maxlength="11" />
			</view>
			<view class="form-item">
				<input type="password" v-model="password" placeholder="请输入密码" />
			</view>
			<view class="form-item">
				<input type="text" v-model="name" :placeholder="userType === 1 ? '请输入姓名' : '请输入企业名称'" />
			</view>
			
			<button class="register-btn" @click="handleRegister">注册</button>
			<view class="login-link" @click="goToLogin">已有账号？立即登录</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userType: 1, // 1: 求职者, 2: 企业
			phone: '',
			password: '',
			name: ''
		}
	},
	methods: {
		async handleRegister() {
			if (!this.phone || !this.password || !this.name) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			if (!/^1\d{10}$/.test(this.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({
				title: '注册中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'userInformationCenter',
					data: {
						action: 'register',
						data: {
							phone: this.phone,
							password: this.password,
							name: this.name,
							userType: this.userType
						}
					}
				})
				
				if (result.result.code === 0) {
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					})
					
					// 跳转到登录页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} else {
					uni.showToast({
						title: result.result.msg,
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '注册失败，请重试',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		},
		
		goToLogin() {
			uni.navigateBack()
		}
	}
}
</script>

<style>
.register-container {
	padding: 60rpx;
	min-height: 100vh;
	background-color: #f8f8f8;
}

.register-header {
	margin-bottom: 80rpx;
	text-align: center;
}

.register-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.register-subtitle {
	font-size: 28rpx;
	color: #666;
}

.register-form {
	background-color: #fff;
	padding: 40rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.user-type {
	display: flex;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.type-item {
	flex: 1;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f5f5f5;
	margin: 0 20rpx;
	border-radius: 44rpx;
	font-size: 28rpx;
	color: #666;
}

.type-item.active {
	background-color: #007AFF;
	color: #fff;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-item input {
	width: 100%;
	height: 88rpx;
	background-color: #f5f5f5;
	border-radius: 44rpx;
	padding: 0 40rpx;
	font-size: 28rpx;
}

.register-btn {
	width: 100%;
	height: 88rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 44rpx;
	font-size: 32rpx;
	margin-top: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-link {
	text-align: center;
	font-size: 28rpx;
	color: #007AFF;
	margin-top: 30rpx;
}
</style> 