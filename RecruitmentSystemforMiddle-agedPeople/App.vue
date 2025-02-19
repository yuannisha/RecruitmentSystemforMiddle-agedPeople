<!--
 * @description 应用入口文件
 -->
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		min-height: 100vh;
		background-color: #f8f8f8;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
			Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
			sans-serif;
	}

	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	/* 按钮点击效果 */
	.button-hover {
		opacity: 0.9;
	}

	/* 清除按钮默认样式 */
	button {
		background-color: transparent;
		padding: 0;
		margin: 0;
		line-height: inherit;
		border-radius: 0;
		border: none;
		font-size: inherit;
		color: inherit;
	}

	button::after {
		border: none;
	}

	/* 清除输入框默认样式 */
	input {
		outline: none;
		border: none;
		margin: 0;
		padding: 0;
		background: transparent;
	}

	/* 统一图片默认样式 */
	image {
		width: 100%;
		height: 100%;
	}
</style>
