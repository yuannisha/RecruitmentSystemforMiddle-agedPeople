<template>
	<view class="edit-container">
		<scroll-view scroll-y class="form-scroll">
			<view class="form-card">
				<!-- 头像上传 -->
				<view class="avatar-section">
					<text class="section-title">头像</text>
					<view class="avatar-upload" @tap="chooseImage('avatar')">
						<image class="avatar-image" :src="formData.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
						<text class="upload-tip">点击更换头像</text>
					</view>
				</view>
				
				<!-- 求职者特有字段 -->
				<template v-if="userType === 1">
					<view class="section-group">
						<text class="section-title">基本信息</text>
						<view class="form-item">
							<text class="label">姓名</text>
							<input class="input" type="text" v-model="formData.name" placeholder="请输入姓名" />
						</view>
						
						<view class="form-item">
							<text class="label">性别</text>
							<picker class="picker" :range="genderOptions" range-key="label" @change="handleGenderChange">
								<view class="picker-value">{{ getGenderLabel(formData.gender) }}</view>
							</picker>
						</view>
						
						<view class="form-item">
							<text class="label">年龄</text>
							<input class="input" type="number" v-model="formData.age" placeholder="请输入年龄" />
						</view>
						
						<view class="form-item">
							<text class="label">学历</text>
							<picker class="picker" :range="educationOptions" @change="handleEducationChange">
								<view class="picker-value">{{ formData.education || '请选择学历' }}</view>
							</picker>
						</view>
					</view>
					
					<view class="section-group">
						<text class="section-title">技能特长</text>
						<view class="skill-input-group">
							<input class="input skill-input" type="text" v-model="skillInput" placeholder="输入技能后点击添加" />
							<button class="add-skill-btn" @tap="addSkill">添加</button>
						</view>
						
						<view class="skills-list" v-if="formData.skills && formData.skills.length > 0">
							<view class="skill-tag" v-for="(skill, index) in formData.skills" :key="index">
								{{ skill }}
								<text class="delete-icon" @tap="removeSkill(index)">×</text>
							</view>
						</view>
					</view>
					
					<view class="section-group">
						<view class="section-header">
							<text class="section-title">工作经历</text>
							<button class="add-exp-btn" @tap="addWorkExperience">
								<text class="add-icon">+</text>
								<text>添加经历</text>
							</button>
						</view>
						
						<view class="experience-card" v-for="(exp, index) in formData.workExperience" :key="index">
							<view class="exp-header">
								<text class="exp-title">工作经历 {{ index + 1 }}</text>
								<text class="delete-icon" @tap="removeWorkExperience(index)">×</text>
							</view>
							<view class="exp-form">
								<input class="input" type="text" v-model="exp.company" placeholder="公司名称" />
								<input class="input" type="text" v-model="exp.position" placeholder="职位" />
								<view class="date-group">
									<picker class="date-picker" mode="date" @change="(e) => handleDateChange(e, index, 'startTime')">
										<view class="picker-value">{{ exp.startTime || '开始时间' }}</view>
									</picker>
									<text class="date-separator">至</text>
									<picker class="date-picker" mode="date" @change="(e) => handleDateChange(e, index, 'endTime')">
										<view class="picker-value">{{ exp.endTime || '结束时间' }}</view>
									</picker>
								</view>
								<textarea class="textarea" v-model="exp.description" placeholder="工作描述"></textarea>
							</view>
						</view>
					</view>
					
					<view class="section-group">
						<text class="section-title">自我介绍</text>
						<textarea class="textarea intro-textarea" v-model="formData.introduction" placeholder="请输入自我介绍"></textarea>
					</view>
				</template>
				
				<!-- 企业特有字段 -->
				<template v-else>
					<view class="section-group">
						<text class="section-title">企业信息</text>
						<view class="form-item">
							<text class="label">企业名称</text>
							<input class="input" type="text" v-model="formData.name" placeholder="请输入企业名称" />
						</view>
						
						<view class="form-item">
							<text class="label">注册资金</text>
							<input class="input" type="text" v-model="formData.registeredCapital" placeholder="请输入注册资金" />
						</view>
						
						<view class="form-item">
							<text class="label">企业规模</text>
							<picker class="picker" :range="scaleOptions" @change="handleScaleChange">
								<view class="picker-value">{{ formData.scale || '请选择企业规模' }}</view>
							</picker>
						</view>
					</view>
					
					<view class="section-group">
						<text class="section-title">企业介绍</text>
						<textarea class="textarea company-textarea" v-model="formData.companyDescription" placeholder="请输入企业介绍"></textarea>
					</view>
					
					<view class="section-group">
						<text class="section-title">企业环境照片</text>
						<view class="image-grid">
							<view class="image-item" v-for="(img, index) in formData.companyImages" :key="index">
								<image class="company-image" :src="img" mode="aspectFill"></image>
								<text class="delete-icon image-delete" @tap="removeImage(index)">×</text>
							</view>
							<view class="add-image" @tap="chooseImage('company')" v-if="formData.companyImages.length < 9">
								<text class="add-icon">+</text>
								<text class="add-text">添加图片</text>
							</view>
						</view>
					</view>
				</template>
				
				<!-- 共同字段 -->
				<view class="section-group">
					<text class="section-title">账号安全</text>
					<view class="form-item">
						<text class="label">手机号</text>
						<input class="input" type="number" v-model="formData.phone" placeholder="请输入手机号" maxlength="11" />
					</view>
					
					<view class="form-item">
						<text class="label">原密码</text>
						<input class="input" type="password" v-model="formData.oldPassword" placeholder="请输入原密码" />
					</view>
					
					<view class="form-item">
						<text class="label">新密码</text>
						<input class="input" type="password" v-model="formData.password" placeholder="请输入新密码" />
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="submit-section">
			<button class="submit-btn" @tap="handleSubmit">保存修改</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userType: 1,
				formData: {
					avatar: '',
					name: '',
					phone: '',
					oldPassword: '',
					password: '',
					// 求职者字段
					gender: 1,
					age: '',
					education: '',
					workExperience: [],
					skills: [],
					introduction: '',
					// 企业字段
					registeredCapital: '',
					scale: '',
					companyDescription: '',
					companyImages: []
				},
				skillInput: '',
				genderOptions: [
					{ value: 1, label: '男' },
					{ value: 2, label: '女' }
				],
				educationOptions: ['高中', '专科', '本科', '硕士', '博士'],
				scaleOptions: ['0-20人', '20-99人', '100-499人', '500人以上']
			}
		},
		onShow() {
			// 获取用户信息
			const userInfo = uni.getStorageSync('userInfo')
            console.log("userInfo",userInfo)
			if (userInfo) {
				this.userType = userInfo.userType
				this.loadUserProfile()
			}
		},
		methods: {
			async loadUserProfile() {
				const userInfo = uni.getStorageSync('userInfo')
				if (!userInfo) return
				
				uni.showLoading({
					title: '加载中'
				})
				
				try {
					const { result } = await uniCloud.callFunction({
						name: 'userInformationCenter',
						data: {
							action: 'getCurrentUser',
							data: {
								userInfo: userInfo
							}
						}
					})
					console.log("result",result)
					if (result.code === 0) {
						this.formData = {
							...this.formData,
							...result.data,
							oldPassword: '',
							password: ''
						}
					}
				} catch (e) {
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			},
			getGenderLabel(value) {
				const option = this.genderOptions.find(opt => opt.value === value)
				return option ? option.label : '请选择性别'
			},
			handleGenderChange(e) {
				this.formData.gender = this.genderOptions[e.detail.value].value
			},
			handleEducationChange(e) {
				this.formData.education = this.educationOptions[e.detail.value]
			},
			handleScaleChange(e) {
				this.formData.scale = this.scaleOptions[e.detail.value]
			},
			addSkill() {
				if (!this.skillInput) return
				if (!this.formData.skills) this.formData.skills = []
				if (!this.formData.skills.includes(this.skillInput)) {
					this.formData.skills.push(this.skillInput)
				}
				this.skillInput = ''
			},
			removeSkill(index) {
				this.formData.skills.splice(index, 1)
			},
			addWorkExperience() {
				if (!this.formData.workExperience) this.formData.workExperience = []
				this.formData.workExperience.push({
					company: '',
					position: '',
					startTime: '',
					endTime: '',
					description: ''
				})
			},
			removeWorkExperience(index) {
				this.formData.workExperience.splice(index, 1)
			},
			handleDateChange(e, index, field) {
				this.formData.workExperience[index][field] = e.detail.value
			},
			async chooseImage(type) {
				try {
					const res = await uni.chooseImage({
						count: type === 'avatar' ? 1 : 9,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera']
					})
					
					// 上传图片到云存储
					uni.showLoading({
						title: '上传中'
					})
					
					const uploadPromises = res.tempFilePaths.map(filePath => {
						return new Promise((resolve, reject) => {
							uniCloud.uploadFile({
								filePath,
								cloudPath: `${type}/${Date.now()}-${Math.random().toString(36).slice(-6)}.${filePath.split('.').pop()}`,
								success: (res) => {
									resolve(res.fileID)
								},
								fail: (err) => {
									reject(err)
								}
							})
						})
					})
					
					const fileIDs = await Promise.all(uploadPromises)
					
					if (type === 'avatar') {
						this.formData.avatar = fileIDs[0]
					} else {
						if (!this.formData.companyImages) this.formData.companyImages = []
						this.formData.companyImages.push(...fileIDs)
					}
					
					uni.hideLoading()
				} catch (e) {
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					})
				}
			},
			removeImage(index) {
				this.formData.companyImages.splice(index, 1)
			},
			async handleSubmit() {
				if (!this.formData.name) {
					uni.showToast({
						title: this.userType === 1 ? '请输入姓名' : '请输入企业名称',
						icon: 'none'
					})
					return
				}
				
				if (this.formData.password && !this.formData.oldPassword) {
					uni.showToast({
						title: '请输入原密码',
						icon: 'none'
					})
					return
				}
				
				uni.showLoading({
					title: '保存中'
				})
                
				try {
					const userInfo = uni.getStorageSync('userInfo')
					const { result } = await uniCloud.callFunction({
						name: 'userInformationCenter',
						data: {
							action: 'updateProfile',
							data: {
								userId: userInfo.userId,
								...this.formData
							}
						}
					})
					
					if (result.code === 0) {
						uni.showToast({
							title: '保存成功'
						})
						// 更新本地存储的用户信息
						const newUserInfo = {
							...userInfo,
							...this.formData
						}
						uni.setStorageSync('userInfo', newUserInfo)
						
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						uni.showToast({
							title: result.msg,
							icon: 'none'
						})
					}
				} catch (e) {
					uni.showToast({
						title: '保存失败',
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
.edit-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	position: relative;
	padding-bottom: 120rpx;
}

.form-scroll {
	height: calc(100vh - 120rpx);
}

.form-card {
	background-color: #fff;
	border-radius: 20rpx;
	margin: 20rpx;
	padding: 30rpx;
}

.section-group {
	margin-bottom: 40rpx;
	padding-bottom: 30rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.section-group:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	display: block;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 40rpx;
}

.avatar-upload {
	position: relative;
	width: 160rpx;
	height: 160rpx;
	margin-top: 20rpx;
}

.avatar-image {
	width: 100%;
	height: 100%;
	border-radius: 80rpx;
	border: 4rpx solid #f0f0f0;
}

.upload-tip {
	position: absolute;
	bottom: -40rpx;
	left: 50%;
	transform: translateX(-50%);
	font-size: 24rpx;
	color: #666;
	white-space: nowrap;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 16rpx;
	display: block;
}

.input {
	width: 100%;
	height: 80rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333;
}

.picker {
	width: 100%;
}

.picker-value {
	width: 100%;
	height: 80rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333;
	display: flex;
	align-items: center;
}

.skill-input-group {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.skill-input {
	flex: 1;
}

.add-skill-btn {
	width: 140rpx;
	height: 80rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 12rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.skills-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.skill-tag {
	background-color: #f0f7ff;
	color: #007AFF;
	padding: 12rpx 24rpx;
	border-radius: 30rpx;
	font-size: 26rpx;
	display: flex;
	align-items: center;
}

.delete-icon {
	margin-left: 12rpx;
	font-size: 32rpx;
	color: #999;
}

.add-exp-btn {
	background-color: #f0f7ff;
	color: #007AFF;
	padding: 12rpx 24rpx;
	border-radius: 30rpx;
	font-size: 26rpx;
	display: flex;
	align-items: center;
}

.add-icon {
	font-size: 32rpx;
	margin-right: 8rpx;
}

.experience-card {
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
}

.exp-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.exp-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.exp-form {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.date-group {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.date-picker {
	flex: 1;
}

.date-separator {
	color: #999;
	font-size: 24rpx;
}

.textarea {
	width: 100%;
	height: 200rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 28rpx;
	color: #333;
}

.image-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;
}

.image-item {
	position: relative;
	aspect-ratio: 1;
}

.company-image {
	width: 100%;
	height: 100%;
	border-radius: 12rpx;
}

.image-delete {
	position: absolute;
	top: -20rpx;
	right: -20rpx;
	width: 40rpx;
	height: 40rpx;
	background-color: rgba(0, 0, 0, 0.5);
	color: #fff;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.add-image {
	aspect-ratio: 1;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.add-text {
	font-size: 24rpx;
	color: #999;
	margin-top: 8rpx;
}

.submit-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 40rpx;
	background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
	width: 100%;
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