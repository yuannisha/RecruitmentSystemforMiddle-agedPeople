<!--
 * @description 登录页面
 -->
<template>
	<view class="login-container">
		<view class="login-header">
			<text class="login-title">欢迎登录</text>
			<text class="login-subtitle">中年人招聘平台</text>
		</view>
		
		<view class="login-form">
			<view class="form-item">
				<input type="text" v-model="phone" placeholder="请输入手机号" maxlength="11" />
			</view>
			<view class="form-item">
				<input type="password" v-model="password" placeholder="请输入密码" />
			</view>
			
			<button class="login-btn" @click="handleLogin">登录</button>
			<view class="register-link" @click="goToRegister">还没有账号？立即注册</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			phone: '',
			password: ''
		}
	},
	methods: {
		async handleLogin() {
			if (!this.phone || !this.password) {
				uni.showToast({
					title: '请输入手机号和密码',
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
				title: '登录中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'userInformationCenter',
					data: {
						action: 'login',
						data: {
							phone: this.phone,
							password: this.password
						}
					}
				})
				
				if (result.result.code === 0) {
					// 保存用户信息
					uni.setStorageSync('userInfo', result.result.data)
                    console.log("result.result.data",result.result.data)
					
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					
					// 跳转到首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 1500)
				} else {
					uni.showToast({
						title: result.result.msg,
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		},
		
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		}
	}
}
</script>

<style>
.login-container {
	padding: 60rpx;
	min-height: 100vh;
	background-color: #f8f8f8;
}

.login-header {
	margin-bottom: 80rpx;
	text-align: center;
}

.login-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.login-subtitle {
	font-size: 28rpx;
	color: #666;
}

.login-form {
	background-color: #fff;
	padding: 40rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
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

.login-btn {
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

.register-link {
	text-align: center;
	font-size: 28rpx;
	color: #007AFF;
	margin-top: 30rpx;
}
</style> 