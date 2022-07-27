 <template>
  <div></div>
  <!-- <div id="qrcode" ref="qrCodeUrl"></div> -->
</template>
    <script>
import request from "@/request";

import { getWxTokenApi } from "@/request/api/wx";
// import QRCode from "qrcodejs2"; // 引入qrcode
import wechatAuth, { getStore, setStore, CONFIG_STORAGE } from "./weChat";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      //控制过期
      btnDisabled: true,
      pay: {},
      payUrl: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    if (/MicroMessenger/.test(window.navigator.userAgent)) {
      // 设置APPID
      const WX_APPID = "wxad7e3bca878b363f";
      wechatAuth.setAppId(WX_APPID);
      let authStatus = getStore(CONFIG_STORAGE.AuthStatusKey); // 微信授权状态
      authStatus = authStatus === null || undefined ? 0 : authStatus;
      switch (Number(authStatus)) {
        case 0:
          // 获取h5页面地址赋值给redirect_uri;
          wechatAuth.redirect_uri = wechatAuth.processUrl();
          // 更改授权状态为1
          setStore(CONFIG_STORAGE.AuthStatusKey, 1);
          // 跳转到获取code访问链接
          console.log("这是url", wechatAuth.authUrl);
          // window.location.href = wechatAuth.authUrl;
          break;
        case 1: {
          // 获取code值
          wechatAuth.returnFromWechat(window.location.href);
          const code = wechatAuth.code;
          // 判断code是否存在
          if (!code) {
            setStore(CONFIG_STORAGE.AuthStatusKey, 0);
          }
          // 使用cod换取eopenId
          getWxTokenApi({ code })
            .then((res) => {
              if (res.code === "0") {
                // 获取openId之后存储，并将状态更改为2
                setStore(CONFIG_STORAGE.openId, res.data);
                setStore(CONFIG_STORAGE.AuthStatusKey, 2);
                // 对路由重定向
                window.location.href = `${window.location.origin}${window.location.pathname}/${window.location.hash}`;
              } else {
                setStore(CONFIG_STORAGE.AuthStatusKey, 0);
              }
            })
            .catch((err) => {
              console.log(err);
              setStore(CONFIG_STORAGE.AuthStatusKey, 0);
            });
          break;
        }
        case 2:
          // 若openId缺失 获取 token过期，状态置为0，去首页重新授权
          if (!getStore(CONFIG_STORAGE.openId)) {
            setStore(CONFIG_STORAGE.AuthStatusKey, 0);
            next("/");
            // 返回首页
          } else {
            next();
          }
          break;
      }
    } else {
      console.log("不在微信，不需要授权");
      next();
    }
  },
  created() {
    const access_token = localStorage.getItem("wx_access_token");
    if (!access_token) {
      // 需要进行授权
      // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx520c15f417810387&redirect_uri=https%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60&response_type=code&scope=snsapi_base&state=123#wechat_redirect
    }
    // 支付
    if (/MicroMessenger/.test(window.navigator.userAgent)) {
      this.text = "微信";
      request({
        type: "post",
        url: "/system/wxpay",
        data: {
          body: "微信支付页面",
          orderNo: "123123123123",
          total_fee: "1",
        },
      })
        .then((res) => {
          this.payUrl = res.data;
          console.log(res.data);
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener(
                "WeixinJSBridgeReady",
                onBridgeReady,
                false
              );
            } else if (document.attachEvent) {
              document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
              document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
            }
          } else {
            this.onBridgeReady();
          }
          // setInterval(() => {
          //   // 开始轮询支付结果
          // }, 3000);
          // ndow.location.replace(res.data.mweb_url+
          // '&redirect_url='+encodeURIComponent(window.location.href+'&tip=yes'))
        })
        .catch(() => {
          setTimeout(() => {
            // window.location.href = "https://www.baidu.com";
          }, 1000);
        });
    } else if (/AlipayClient/.test(window.navigator.userAgent)) {
      request({
        type: "post",
        url: "/system/alipay",
        data: {
          body: "支付宝支付页面",
          orderNo: "164007241712323",
          total_fee: "0.01",
        },
      })
        .then((res) => {
          // this.payUrl = res.data;
          var resData = res.data;
          const div = document.createElement("div");
          div.id = "alipay";
          div.innerHTML = resData;
          document.body.appendChild(div);
          document.querySelector("#alipay").children[0].submit(); // 执行后会唤起支付宝
        })
        .catch(() => {
          setTimeout(() => {
            // window.location.href = "https://www.baidu.com";
          }, 1000);
        });
    } else {
      // alert("请再微信或支付宝中打开！");
      request({
        type: "post",
        url: "/system/alipay",
        data: {
          body: "支付宝支付页面",
          orderNo: `16400724173223${Math.ceil(Math.random() * 1000)}`,
          total_fee: "0.01",
        },
      })
        .then((res) => {
          this.payUrl = res.data.qr_code;
          console.log(res.data);
          //   this.$nexttick(() => {
          // this.qrcode();
          //   });
        })
        .catch(() => {});
    }
  },

  methods: {
    // qrcode() {
    //   new QRCode(this.$refs.qrCodeUrl, {
    //     width: 132,
    //     height: 132,
    //     text: this.payUrl, // 二维码地址
    //     colorDark: "#000",
    //     colorLight: "#fff",
    //   });
    // },
    // 拉起微信支付
    onBridgeReady() {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: "wx2421b1c4370ec43b", //公众号ID，由商户传入
          timeStamp: "1395712654", //时间戳，自1970年以来的秒数
          nonceStr: "e61463f8efa94090b1f366cccfbbb444", //随机串
          package: "prepay_id=up_wx21201855730335ac86f8c43d1889123400",
          signType: "RSA", //微信签名方式：
          paySign:
            "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq/xDg==", //微信签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
        }
      );
    },

    handelPay() {
      window.location.href = this.payUrl;
    },
  },
};
</script>