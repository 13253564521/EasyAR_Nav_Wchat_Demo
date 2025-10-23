const SPARPlugin = requirePlugin('SPARPlugin');

// app.js
App({
    // TODO：请在此处填写您的license
    license: '',
    async onLaunch() {
        const engine = await requirePlugin.async('SPAREngine');
        const easyarCore = await requirePlugin.async('easyar-core')
        SPARPlugin.inject(engine,easyarCore)
        const { setLicense } = SPARPlugin;
        // TODO：请在此处填写您的小程序 appid
        await setLicense(this.license, "")
        console.log('------初始化插件完成------');
    },
})
