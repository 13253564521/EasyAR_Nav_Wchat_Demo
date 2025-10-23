const sysInfo = wx.getSystemInfoSync();
const { tinyAllinone } = requirePlugin('SPARPlugin');
const { ARManager, TinyLuncher, LoadCondition, TinyRootType, AssistantPlugin, initNavSystem, NavManager } = tinyAllinone;

ARManager.instance.logger.setLevel(0);
Page({
  data: {
    wxapi: wx,
    canvasW: sysInfo.windowWidth,
    canvasH: sysInfo.windowHeight,
    canvasT: 0,
    canvasL: 0,
    show: false,
    debug: true,
    // 张江在线办公室-ARMall账号
    clsConfig: {
      apiKey: "2e93fa9d687800c1dc8a2894fb059ca1",
      apiSecret: "5396d1cc471ad79ba4d7d5ed546ae5be12debb203417ee38c9b4d69c486c1590",
      clsAppId: "0ebb27c1746a49598eb9af7975b67d84",
      arannotationId: "4992eccf7d5c606c805ea8ced3970dfc",
      serverAddress: "https://clsv3-api.easyar.com"
    },
    // 是否开启定位
    running: true,
    multiMapSetting: null,
    blackList: {
      // "vk6Dof": [sysInfo.model],
      // "vk5Dof":[sysInfo.model],
      // "vk3Dof": [sysInfo.model],
      // "camera5Dof": [sysInfo.model],
      // "camera3Dof": ["iPhone 15 pro<iPhone16,1>"],
      // "camera0Dof": []
    }
  },
  onLoad: function (options) {
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
  },
  onReady: function () {
    setTimeout(() => {
      this.setData({
        show: true
      })
    }, 500);
  },
  onUnload: function () {
    if (this.tinyLuncher) {
      this.tinyLuncher.destroy();
    }

  },
  // 3D 引擎初始化完成回调
  onLoadPC(e) {
    console.log("playcanvas 启动成功");
    this.pcCtx = e.detail;
    this.app = this.pcCtx.app;
    this.tinyLuncher = TinyLuncher.Instance;
  },
  // AR 初始化完成回调，通常晚于 3D 引擎初始化完成回调
  onLoadCamera(e) {
    console.log("AR 启动成功");
    // 代表 AR Start 成功
    this.arManager = e.detail;// e.detail == ARManager.instance
    this.vkSession = this.arManager.arCtrl.curARSession;
  },
  // EMA 加载完成回调，通常晚于 3D 引擎初始化完成回调
  onLoadEMA(e) {
    console.log("EMA 加载成功");
    this.ema = e.detail;
    console.info(this.ema);
    if (this.tinyLuncher) {
      // 将 unity 当中所标注的位置信息初始化到场景当中，
      // 如果在 unity 当中使用脚本挂载了 tinyapp，将一并初始化
      // 如果 show 为 false 时会创建空节点
      this.emaTinyRoot = this.tinyLuncher.instantiateFromAnotation(
        {
          type: "Annotation",
          ema: this.ema,
          externalData: {
            // 设置为 true 时会在标注的位置画一个 cube
            show: true
          }
        });
    }
  },
  // clsClient 初始化完成回调,是 AR 系统 3D 引擎初始化完成的统一回调，此回调中可以拿到所有上下文
  onClsClientLoad(e) {
    let { VKSessionContext, PCContext } = e.detail;
    this.vkCtx = VKSessionContext;
    this.pcCtx = PCContext;
    console.log("onClsClientLoad", e.detail);
    // this.ema = VKSessionContext.self.clsdata?.ema;
    // console.log('ema', this.ema);
    this.camera = this.pcCtx.camera;
    this.app = this.pcCtx.app;
  },
  onClsClientResult(e) {
    console.log("onClsClientResult", e.detail);
    if (e.detail.statusCode == 0) {
      console.log("定位到地图：", e.detail.result._blockId)
      // 定位成功
      let cameraPosition = this.pcCtx.camera.getPosition();
      console.log("当前相机位置：", cameraPosition);
    } else {
      // 定位失败
    }
  },
  onClsClientError(e) {
    console.log("onClsClientError", e.detail);
  }
});