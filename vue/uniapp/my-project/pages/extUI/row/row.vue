<template>
	<view class="warp">
		<!-- #ifndef APP-NVUE -->
		<text class="example-info">流式栅格系统，随着屏幕或视口分为 24 份，可以迅速简便地创建布局</text>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<text class="example-info">流式栅格系统，在nvue不可使用媒体查询</text>
		<!-- #endif -->

		<uni-section title="基础布局" subTitle="使用单一分栏创建基础的栅格布局" type="line"></uni-section>
		<view class="example-body">
			<uni-row class="demo-uni-row" :width="nvueWidth">
				<uni-col>
					<view class="demo-uni-col dark_deep"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :width="nvueWidth">
				<uni-col :span="12">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="12">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :width="nvueWidth">
				<uni-col :span="8">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="8">
					<view class="demo-uni-col light"></view>
				</uni-col>
				<uni-col :span="8">
					<view class="demo-uni-col dark"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="6">
					<view class="demo-uni-col light"></view>
				</uni-col>
				<uni-col :span="6">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="6">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :width="nvueWidth">
				<uni-col :span="4">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col light"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col light"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>
		</view>

		<uni-section title="混合布局" subTitle="通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局" type="line"></uni-section>
		<view class="example-body">
			<uni-row class="demo-uni-row" :gutter="gutter" :width="nvueWidth">
				<uni-col :span="8">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="8">
					<view class="demo-uni-col light"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :gutter="gutter" :width="nvueWidth">
				<uni-col :span="4">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="16">
					<view class="demo-uni-col light"></view>
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col dark"></view>
				</uni-col>
			</uni-row>
		</view>

		<uni-section title="分栏偏移" subTitle="支持偏移指定的栏数" type="line"></uni-section>
		<view class="example-body">
			<uni-row class="demo-uni-row" :gutter="gutter" :width="nvueWidth">
				<uni-col :span="8">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="8" :offset="6">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :gutter="gutter" :width="nvueWidth">
				<uni-col :span="6" :offset="6">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="6" :offset="6">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :gutter="gutter" :width="nvueWidth">
				<uni-col :span="12" :pull="6">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="6" :push="6">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row" :gutter="gutter" :width="nvueWidth">
				<uni-col :span="12" :offset="6">
					<view class="demo-uni-col dark"></view>
				</uni-col>
			</uni-row>
		</view>

		<!-- #ifndef APP-NVUE -->
		<uni-section title="响应式布局" subTitle="共五个响应尺寸：xs、sm、md、lg 和 xl" type="line"></uni-section>
		<view class="example-body">
			<uni-row class="demo-uni-row" :gutter="gutter">
				<uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
					<view class="demo-uni-col light"></view>
				</uni-col>
				<uni-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gutter: 0,
				nvueWidth: 730
			}
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

	.demo-uni-row {
		margin-bottom: 10px;
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}

	/* #ifdef MP-ALIPAY || MP-WEIXIN */
	::v-deep .uni-row {
		margin-bottom: 10px;
	}

	/* #endif */
	.demo-uni-col {
		height: 36px;
		border-radius: 3px;
	}

	.dark_deep {
		background-color: #99a9bf;
	}

	.dark {
		background-color: #d3dce6;
	}

	.light {
		background-color: #e5e9f2;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 5rpx 10rpx 0;
		overflow: hidden;
	}
</style>