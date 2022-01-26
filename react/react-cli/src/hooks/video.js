import { useEffect, useRef } from "react";
import videojs from "video.js";
import nodeVedio from "../assets/49 node.js实战.mp4";
import "video.js/dist/video-js.css";
import "./video.css";
// 渲染视频播放器

const mp4MiddWay = (player) => {
  return {
    // 设置播放源时
    setSource: function (srcObj, next) {
      // console.log(srcObj,next)
      // pass null as the first argument to indicate that the source is not rejected
      next(null, srcObj);
    },
    callReady: () => {
      return true;
    },
    ready: (terminated, value) => {
      console.log(terminated, value);
    },
    // 调用前（Tech阶段）
    callPlay: function () {
      //   return videojs.middleware.TERMINATOR;
      return true;
    },
    // 调用时（Player阶段）
    play: function (terminated, value) {
      console.log(terminated, value);
      if (terminated) {
        console.log("The play was middleware terminated.");
      } else if (value && value.then) {
        value
          .then(function (res) {
            console.log("The play succeeded!");
          })
          .catch(function (err) {
            console.log("The play was rejected", err);
          });
      }
    },
  };
};
// *  代表所有
// mp4中间件
videojs.use("video/mp4", mp4MiddWay);
const useVideoCreate = (ref, option, callback) => {
  const playerRef = useRef(null);

  if (!option) {
    option = {
      // liveui: true,
      // trackingThreshold: 2,

      controls: true, // 播放器是否具有用户可以与之交互的控件

      preload: "auto", //向浏览器建议是否应在<video>加载元素后立即开始下载视频数据
      /*   'auto'
            立即开始加载视频（如果浏览器支持）。一些移动设备不会预加载视频以保护其用户的带宽/数据使用。这就是为什么该值被称为“自动”而不是像'true'.
            这往往是最常见和推荐的值，因为它允许浏览器选择最佳行为。
            'metadata'
            仅加载视频的元数据，其中包括视频的时长和尺寸等信息。有时，会通过下载几帧视频来加载元数据。
            'none'
            不要预加载任何数据。浏览器将等到用户点击“播放”开始下载。 
        */
      // width: 500,
      // height: 500,

      //   src:"" //视频源的源 URL

      loop: true, //视频在结束后立即重新开始

      muted: false, // 是否静音

      // poster:urlAlphabet,// 视频加载时的图片

      autoplay: true, // true  false 'muted'静音播放 推荐使用player.play()手动控制自动播放，永远不要假设自动播放会起作用。
      // aspectRatio: "16:9", //将播放器置于流体模式，并在计算播放器的动态大小时使用该值

      // fluid: true, // 自适应宽高(流体布局)

      fill: true, // 填充模式(针对父级)

      // responsive:true,// 响应模式

      //   breakpoints与responsiveoption一起使用时，设置断点，这些断点将配置类名称在播放器上的切换方式，以根据播放器的尺寸调整 UI。
      // breakpoints: {
      //   tiny: 300,
      //   xsmall: 400,
      //   small: 500,
      //   medium: 600,
      //   large: 700,
      //   xlarge: 800,
      //   huge: 900, //无效？
      // },
      //  倍数播放
      playbackRates: [0.5, 1, 1.5, 2],
      VolumeBar : { inline: !1, vertical: true,aspectRatio:"16:9"},
      // noUITitleAttributes:true,
      children: [
        "playToggle",
        "volumePanel",
        "liveDisplay",
        "currentTimeDisplay",
        "progressControl",
        "durationDisplay",
        "chaptersButton",
        "descriptionsButton",
        "subsCapsButton",
        "audioTrackButton",
        "fullscreenToggle",
      ],
      // controlBar: {
      //   children: [
      // //     // { name: "playToggle" }, // 播放按钮
      // //     // { name: "currentTimeDisplay" }, // 当前已播放时间
      // //     { name: "progressControl" }, // 播放进度条
      // //     { name: "durationDisplay" }, // 总时间
      // //     {
      // //       // 倍数播放
      // //       name: "playbackRateMenuButton",
      // //     },
      // //     // {
      // //     //   name: "volumePanel", // 音量控制
      // //     //   inline: false, // 不使用水平方式
      // //     // },
      // //     // { name: "FullscreenToggle" }, // 全屏
      //   ],
      // },
      language: "zh-CN", // 设置语言

      //   ???
      // inactivityTimeout: 0, //表明用户正在通过"vjs-user-active"和"vjs-user-inactive"类和"useractive"事件与播放器进行交互,值0表示不存在，inactivityTimeout并且用户永远不会被视为不活动。
      //   ???

      // controlBar: { remainingTimeDisplay: { displayNegative: false } }
      // 视频源
      sources: [
        {
          src: nodeVedio,
          type: "video/mp4",
        },
        {
          src: nodeVedio,
          type: "video/webm",
        },
      ],
    };
  } else {
    if (option) {
      // 动态加载语言包
      if (option.language) {
        import(`video.js/dist/lang/${option.language}.json`).then((res) => {
          videojs.addLanguage(option.language, res);
        });
      }
    }
  }

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = ref.current;
      if (!videoElement) throw "ref Dom元素不存在";
      const player = (playerRef.current = videojs(videoElement, option, () => {
        console.log("player is ready");
      }));

      // 自动播放最佳实践
      player.on("ready", function () {
        var promise = player.play();
        player.enableTouchActivity();
        if (promise !== undefined) {
          promise
            .then(function () {
              // 自动播放开始
              // videojs.log("Autoplay started!")
            })
            .catch(function (error) {
              // 自动播放出错
              // videojs.log("Autoplay was prevented")
            });
        }
        //   console.log(videojs.players);
      });
    }
  }, [option, ref]);
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);
};
export default useVideoCreate;

// var Button = videojs.getComponent("Button");
// var button = new Button(player, {
//   clickHandler: function (event) {
//     videojs.log("Clicked");
//   },
// });
// player.addChild("button");

/*    // 视频暂时时候创建一个dom dom关闭时视频开始播放
    player.on("pause", function () {
      // Modals are temporary by default. They dispose themselves when they are
      // closed; so, we can create a new one each time the player is paused and
      // not worry about leaving extra nodes hanging around.
      var modal = player.createModal("This is a modal!");

      // When the modal closes, resume playback.
      modal.on("modalclose", function () {
        player.play();
      });
    });
 */

/*   
    添加一个弹窗
     var ModalDialog = videojs.getComponent("ModalDialog");
    var modal = new ModalDialog(player, {
      // We don't want this modal to go away when it closes.
      temporary: false,
    });

    player.addChild(modal);

    // 视频暂停弹窗打开
    player.on("pause", function () {
      modal.open();
    });

    // 视频播放弹窗关闭
    player.on("play", function () {
      modal.close();
    }); */

// player.on("enableTouchActivity",function(){
//   console.log('enableTouchActivity')
// })
// return {
//   if(player) {
//     player.dispose();
//   },
// };

//   hooks
//   videojs.hook('beforesetup', function(videoEl, options) {
//         console.log(videoEl,options)
//     // videoEl will be the video element with id="some-id" since that
//     // gets passed to videojs() below. On subsequent calls, it will be
//     // different.

//     videoEl.className += ' some-super-class';

//     // autoplay will be true here, since we passed it as such.
//     if (options.autoplay) {
//       options.autoplay = false
//     }

//     // Options that are returned here will be merged with old options.
//     //
//     // In this example options will now be:
//     //   {autoplay: false, controls: true}
//     //
//     // This has the practical effect of always disabling autoplay no matter
//     // what options are passed to videojs().
//     return options;
//   });

//   videojs.hook('beforeerror', function(player, err) {
//     const error = player.error();

//     // prevent current error from being cleared out
//     if (err === null) {
//       return error;
//     }

//     // but allow changing to a new error
//     return err;
//   });
