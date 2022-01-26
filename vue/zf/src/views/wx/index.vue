 <template>
  <div>
    <!-- <form name="submit_form" method="post" :action="action">
      <input type="submit" value="提交" style="display: none" />
    </form> -->
  </div>
</template>
<script>
import cookies from "js-cookie";
import { getWxTokenApi, getZfbTokenApi } from "@/request/api/wx";
import wechatAuth, {
  getStore,
  setStore,
  CONFIG_STORAGE,
  getQueryObject,
} from "./weChat";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      //控制过期
      btnDisabled: true,
      pay: {},
      UA: "",
      action: "",
    };
  },
  created() {
    // console.log( ap.tradePay)
    // if (!localStorage.getItem("aaa")) {
    //     cookies.remove("Auth-Status");
    //     cookies.remove("WX_OPENID");
    //     localStorage.setItem("aaa", true)
    // }
    if (
      /MicroMessenger/.test(window.navigator.userAgent) &&
      window.navigator.userAgent.match(/wxwork/i) != "wxwork"
    ) {
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
          // 获取code值
          wechatAuth.returnFromWechat(window.location.href);
          const code = wechatAuth.code;
          // 判断code是否存在
          if (!code) {
            setStore(CONFIG_STORAGE.AuthStatusKey, 0);
          }
          getWxTokenApi({
            code,
            body: "Test",
            orderNo: `16400sff724${Math.ceil(Math.random() * 1000)}`,
            total_fee: 1,
          })
            .then((res) => {
              if (res.data.code == "0") {
                // 获取tc之后存储，并将状态更改为2
                setStore(CONFIG_STORAGE.tc, res.data.tc);
                setStore(CONFIG_STORAGE.AuthStatusKey, 2);
                try {
                  this.onWx({
                    appId: res.data.result.appId,
                    timeStamp: res.data.result.timeStamp,
                    nonceStr: res.data.result.nonceStr,
                    package: res.data.result.package,
                    signType: "RSA",
                    paySign: res.data.result.paySign,
                  });
                } catch (error) {
                  setStore(CONFIG_STORAGE.AuthStatusKey, 0);

                  alert("拉取失败");
                }
              } else {
                alert("wx code不是0");

                setStore(CONFIG_STORAGE.AuthStatusKey, 0);
              }
            })
            .catch((err) => {
              setStore(CONFIG_STORAGE.AuthStatusKey, 0);
              alert("tc换取失败");
            });
          break;
        }
        case 2:
          // 若tc缺失，状态置为0，去首页重新授权
          if (!getStore(CONFIG_STORAGE.tc)) {
            setStore(CONFIG_STORAGE.AuthStatusKey, 0);
            this.UA = "tc不存在";
            // 返回首页
            // window.location.href = 首页;
          } else {
            this.UA = "验证通过";
            // 解码获取url参数
            // let data = getQueryObject(window.location.href);
            getWxTokenApi({
              tc: getStore(CONFIG_STORAGE.tc),
              body: "Test",
              orderNo: `16400sff724${Math.ceil(Math.random() * 1000)}`,
              total_fee: 1,
            })
              .then((res) => {
                try {
                  this.onWx({
                    appId: res.data.result.appId,
                    timeStamp: res.data.result.timeStamp,
                    nonceStr: res.data.result.nonceStr,
                    package: res.data.result.package,
                    signType: "RSA",
                    paySign: res.data.result.paySign,
                  });
                } catch (error) {
                  alert("拉起支付失败");
                  setStore(CONFIG_STORAGE.AuthStatusKey, 0);
                }
              })
              .catch(() => {
                alert("tc支付失败");
                setStore(CONFIG_STORAGE.AuthStatusKey, 0);
              });
          }
          break;
      }
    } else if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.UA = "zfb";
      getZfbTokenApi({
        body: "支付宝支付页面",
        orderNo: `16400sff724${Math.ceil(Math.random() * 1000)}`,
        total_fee: "0.01",
      })
        .then((res) => {
          let data = getQueryObject(res.data);
          console.log(data);
          try {
            // var resData = res.data;
            // const div = document.createElement("div");
            // div.id = "alipay";
            // div.innerHTML = resData;
            // document.body.appendChild(div);
            // document.querySelector("#alipay").children[0].submit(); // 执行后会唤起支付宝
            // this.action = data.notify_url;
            // console.log(this.action);
            // console.log(document.forms[0]);
            // console.log(document.forms[0].submit);
            // this.$nextTick(() => {
            //     console.log(document.forms[0]);
            //     console.log(document.forms[0].submit);
            //     // document.forms[0].submit();
            // });
            ap.tradePay(
              {
                orderStr: res.data,
              },
              function (res) {
                alert("ok");
                ap.alert(res.resultCode);
              }
            );
          } catch (error) {
            console.log("zfb-----------------------");
            console.log(error);
            console.log("zfb-----------------------");
            alert("拉起支付宝出问题了");
          }
        })
        .catch(() => {
          alert("支付宝接口出错");
        });
    } else {
      alert("请再微信或支付宝中打开！");
    }
  },
  methods: {
    // 拉起微信支付
    onWx(data) {
      console.log("onWx");
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            this.onBridgeReady(data),
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady(data));
          document.attachEvent(
            "onWeixinJSBridgeReady",
            this.onBridgeReady(data)
          );
        }
      } else {
        this.onBridgeReady(data);
      }
    },
    onBridgeReady(data) {
      console.log("onBridgeReady");
      console.log(data);
      WeixinJSBridge.invoke("getBrandWCPayRequest", data, function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          // 轮询支付结果
          alert("支付ok");
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
          alert("取消支付");

          // 立刻调用撤销接口撤销交易
        } else {
          alert("支付失败");
        }
      });
    },
  },
};
</script>