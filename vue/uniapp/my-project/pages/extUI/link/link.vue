<template>
	<view class="page">
		<text class="example-info">超链接组件，在小程序内复制url，在app内打开外部浏览器，在h5端打开新网页。</text>
		<uni-section title="基本示例" type="line"></uni-section>
		<view class="example-body">
			<uni-link href="https://uniapp.dcloud.io/" text="https://uniapp.dcloud.io/"></uni-link>
		</view>
		<uni-section title="自定义样式" type="line"></uni-section>
		<view class="example-body">
			<uni-link href="https://uniapp.dcloud.io/" text="https://uniapp.dcloud.io/" showUnderLine="false" color="#0000FF"></uni-link>
		</view>
		<uni-section title="支持插槽" type="line"></uni-section>
		<view class="example-body">
			<uni-link href="https://uniapp.dcloud.io/" text="https://uniapp.dcloud.io/" showUnderLine="false" color="#0000FF">插槽内容</uni-link>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {};
		}
	};
</script>

<style>
	/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url("~@/static/uni.ttf") format("truetype");
	}

	/* #endif */
	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	.example {
		padding: 0 15px 15px;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	/* #endif */
	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.word-btn-white {
		font-size: 18px;
		color: #FFFFFF;
	}

	.word-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #007AFF;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}

	.example-body {
		flex-direction: row;
		justify-content: flex-start;
	}
</style>