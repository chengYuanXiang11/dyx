<template>
	<view>
		<text class="example-info">日期格式化组件，通常用于需要展示友好的日期格式的场景</text>
		<uni-section title="基础用法" type="line"></uni-section>
		<view class="example-body">
			<uni-dateformat :date="now - 7200000"></uni-dateformat>
			<uni-dateformat date="2020/12/12"></uni-dateformat>
		</view>
		<uni-section title="设置阈值" type="line"></uni-section>
		<text class="example-info">阈值用于控制什么时候显示刚刚|马上，什么时候显示xx分钟前|xx分钟后</text>
		<view class="example-body">
			<uni-dateformat :date="now - 30000" :threshold="[0,3600000]"></uni-dateformat>
			<uni-dateformat :date="now - 30000" :threshold="[0,0]"></uni-dateformat>
		</view>
		<uni-section title="使用英文" type="line"></uni-section>
		<view class="example-body">
			<uni-dateformat :date="now - 1200000" :threshold="[60000,3600000]" locale="en"></uni-dateformat>
			<uni-dateformat :date="now - 30000" :threshold="[60000,3600000]" locale="en"></uni-dateformat>
			<uni-dateformat :date="now - 80000" :threshold="[60000,3600000]" locale="en"></uni-dateformat>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				now: Date.now()
			}
		},
		methods: {

		}
	}
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
		line-height: 1.5em;
	}
</style>