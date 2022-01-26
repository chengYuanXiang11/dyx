 <template>
  <div>
    11111111

    <!-- <form
      name="submit_form"
      method="post"
      :action="action"
      ref=""
      @submit.prevent="submit"
    >
      <input type="submit" value="提交" style="display: none" />
    </form> -->
  </div>
</template>
    <script>
import { getWxTokenApi } from "./utils/axos";
import wechatAuth, { getStore, setStore, CONFIG_STORAGE } from "./utils/weChat";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      //控制过期
      btnDisabled: true,
      pay: {},
      payUrl: "",
      action: "",
    };
  },
  created() {
    console.log(ap.tradePay);

    if (/MicroMessenger/.test(window.navigator.userAgent)) {
      // 设置APPID
      const WX_APPID = "wxb5cb2e91c3c80cb5";
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
          window.location.href = wechatAuth.authUrl;
          break;
        case 1: {
          // // 获取code值
          wechatAuth.returnFromWechat(window.location.href);
          const code = wechatAuth.code;
          // 判断code是否存在
          if (!code) {
            setStore(CONFIG_STORAGE.AuthStatusKey, 0);
          }
          console.log(code);
          // // 使用cod换取openId
          // getWxTokenApi({
          //   code,
          // })
          //   .then((res) => {
          //     if (res.code === "0") {
          //       // 获取openId之后存储，并将状态更改为2
          //       setStore(CONFIG_STORAGE.openId, res.data.openId);
          //       setStore(CONFIG_STORAGE.AuthStatusKey, 2);
          //       // 对路由重定向
          //       window.location.href = `${window.location.origin}${window.location.pathname}/${window.location.hash}`;
          //     } else {
          //       setStore(CONFIG_STORAGE.AuthStatusKey, 0);
          //     }
          //   })
          //   .catch((err) => {
          //     setStore(CONFIG_STORAGE.AuthStatusKey, 0);
          //   });
          break;
        }
        case 2:
          // // 若openId缺失，状态置为0，去首页重新授权
          // if (!getStore(CONFIG_STORAGE.openId)) {
          //   setStore(CONFIG_STORAGE.AuthStatusKey, 0);
          //   this.UA = "openId不存在";
          //   // 返回首页
          //   // window.location.href = 首页;
          // } else {
          //   this.UA = "验证通过";
          //   // 解码获取url参数
          //   // let data = getQueryObject(window.location.href);
          //   pullUpWx({
          //     body: "微信支付页面",
          //     orderNo: "123123123123",
          //     total_fee: "1",
          //     // data
          //   })
          //     .then((res) => {
          //       // 点击支付按钮
          //       if (typeof WeixinJSBridge == "undefined") {
          //         if (document.addEventListener) {
          //           document.addEventListener(
          //             "WeixinJSBridgeReady",
          //             this.onBridgeReady(data),
          //             false
          //           );
          //         } else if (document.attachEvent) {
          //           document.attachEvent(
          //             "WeixinJSBridgeReady",
          //             this.onBridgeReady(data)
          //           );
          //           document.attachEvent(
          //             "onWeixinJSBridgeReady",
          //             this.onBridgeReady(data)
          //           );
          //         }
          //       } else {
          //         this.onBridgeReady(data);
          //       }
          //       // setInterval(() => {
          //       //   // 开始轮询支付结果
          //       // }, 3000);
          //       // window.location.replace(res.data.mweb_url+
          //       // '&redirect_url='+encodeURIComponent(window.location.href+'&tip=yes'))
          //     })
          //     .catch(() => {
          //       setTimeout(() => {
          //         // window.location.href = "https://www.baidu.com";
          //       }, 1000);
          //     });
          // }
          break;
      }
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
    }
  },

  methods: {
    // 拉起微信支付
    onBridgeReady(data) {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: "wxb5cb2e91c3c80cb5", //公众号ID，由商户传入
          timeStamp: Math.floor(new Date().getTime() / 1000), //时间戳，自1970年以来的秒数
          nonceStr: "e61463f8efa94090b1f366cccfbbb444", //随机串
          // package: "prepay_id=up_wx21201855730335ac86f8c43d1889123400",
          package: `prepay_id=${data.prepay_id}`,
          signType: "RSA", //微信签名方式：
          paySign:
            "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq/xDg==", //微信签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // 轮询支付结果
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            window.tools.alert.message("取消支付");
            // 立刻调用撤销接口撤销交易
          } else {
            window.tools.alert.error("支付失败");
          }
        }
      );
    },
  },
};
</script>