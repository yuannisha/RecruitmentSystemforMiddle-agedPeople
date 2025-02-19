<!--
 * @description 发布职位页面
 -->
<template>
	<view class="post-container">
		<view class="form-group">
			<view class="form-item">
				<text class="label">职位名称</text>
				<input type="text" v-model="formData.title" placeholder="请输入职位名称" />
			</view>
			
			<view class="form-item">
				<text class="label">薪资范围</text>
				<input type="text" v-model="formData.salary" placeholder="例如：8k-12k" />
			</view>
			
			<view class="form-item">
				<text class="label">工作经验</text>
				<picker 
					:value="experienceIndex" 
					:range="experienceOptions"
					@change="handleExperienceChange"
				>
					<view class="picker-value">{{ formData.experience || '请选择工作经验' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">学历要求</text>
				<picker 
					:value="educationIndex" 
					:range="educationOptions"
					@change="handleEducationChange"
				>
					<view class="picker-value">{{ formData.education || '请选择学历要求' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">工作地点</text>
				<input type="text" v-model="formData.location" placeholder="请输入工作地点" />
			</view>
			
			<view class="form-item">
				<text class="label">详细地址</text>
				<input type="text" v-model="formData.address" placeholder="请输入详细地址" />
			</view>
		</view>
		
		<view class="form-group">
			<view class="form-item">
				<text class="label">职位描述</text>
				<textarea 
					v-model="formData.description" 
					placeholder="请输入职位描述"
					maxlength="1000"
				></textarea>
			</view>
			
			<view class="form-item">
				<text class="label">任职要求</text>
				<textarea 
					v-model="formData.requirement" 
					placeholder="请输入任职要求"
					maxlength="1000"
				></textarea>
			</view>
		</view>
		
		<button class="submit-btn" @click="handleSubmit">发布职位</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null,
			formData: {
				title: '',
				salary: '',
				experience: '',
				education: '',
				location: '',
				address: '',
				description: '',
				requirement: ''
			},
			experienceIndex: 0,
			experienceOptions: [
				'不限',
				'应届生',
				'1-3年',
				'3-5年',
				'5-10年',
				'10年以上'
			],
			educationIndex: 0,
			educationOptions: [
				'不限',
				'高中',
				'大专',
				'本科',
				'硕士',
				'博士'
			]
		}
	},
	onLoad() {
		this.userInfo = uni.getStorageSync('userInfo')
		
		if (!this.userInfo || this.userInfo.userType !== 2) {
			uni.showToast({
				title: '非企业用户不能发布职位',
				icon: 'none'
			})
			
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	},
	methods: {
		handleExperienceChange(e) {
			this.experienceIndex = e.detail.value
			this.formData.experience = this.experienceOptions[this.experienceIndex]
		},
		
		handleEducationChange(e) {
			this.educationIndex = e.detail.value
			this.formData.education = this.educationOptions[this.educationIndex]
		},
		
		async handleSubmit() {
			// 表单验证
			if (!this.formData.title) {
				uni.showToast({
					title: '请输入职位名称',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.salary) {
				uni.showToast({
					title: '请输入薪资范围',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.location) {
				uni.showToast({
					title: '请输入工作地点',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.description) {
				uni.showToast({
					title: '请输入职位描述',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.requirement) {
				uni.showToast({
					title: '请输入任职要求',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({
				title: '发布中...'
			})
			
			try {
				const result = await uniCloud.callFunction({
					name: 'jobCenter',
					data: {
						action: 'postJob',
						data: {
							userId: this.userInfo.userId,
							...this.formData
						}
					}
				})
				
				if (result.result.code === 0) {
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					})
					
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
					title: '发布失败，请重试',
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
.post-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding: 20rpx;
	padding-bottom: 120rpx;
}

.form-group {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
}

input {
	width: 100%;
	height: 80rpx;
	background-color: #f5f5f5;
	border-radius: 40rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
}

.picker-value {
	width: 100%;
	height: 80rpx;
	background-color: #f5f5f5;
	border-radius: 40rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	line-height: 80rpx;
	color: #333;
}

textarea {
	width: 100%;
	height: 200rpx;
	background-color: #f5f5f5;
	border-radius: 20rpx;
	padding: 20rpx 30rpx;
	font-size: 28rpx;
}

.submit-btn {
	position: fixed;
	left: 40rpx;
	right: 40rpx;
	bottom: 40rpx;
	height: 80rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 40rpx;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style> 