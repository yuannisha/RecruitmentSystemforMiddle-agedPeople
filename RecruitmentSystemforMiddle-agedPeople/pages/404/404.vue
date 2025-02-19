<!--
 * @description 404页面
 -->
<template>
	<view class="not-found">
		<text class="title">页面不存在</text>
		<text class="subtitle">抱歉，您访问的页面不存在</text>
		<button class="back-btn" @click="goBack">返回上一页</button>
	</view>
</template>

<script>
export default {
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1
			})
		}
	}
}
</script>

<style>
.not-found {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 60rpx;
}

.back-btn {
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
</style> 