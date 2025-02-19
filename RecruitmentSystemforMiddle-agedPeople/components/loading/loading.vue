<!--
 * @description 加载中组件
 -->
<template>
	<view class="loading" v-if="show">
		<view class="loading-spinner"></view>
		<text class="loading-text">{{ text }}</text>
	</view>
</template>

<script>
export default {
	name: 'Loading',
	props: {
		show: {
			type: Boolean,
			default: true
		},
		text: {
			type: String,
			default: '加载中...'
		}
	}
}
</script>

<style>
.loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 30rpx;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 6rpx solid #f3f3f3;
	border-top: 6rpx solid #007AFF;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 20rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #666;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style> 