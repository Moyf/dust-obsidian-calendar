import {App, Plugin, PluginManifest} from 'obsidian';
import {CalendarView, VIEW_TYPE_CALENDAR} from './view/CalendarView';
import MainSettingTable from "./setting/MainSettingTable";
import MainController from "./core/MainController";


// 插件对象
export default class DustDiaryPlugin extends Plugin {

    private readonly mainController: MainController;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.mainController = new MainController(this);
    }

    // 插件开启时执行初始化操作
    async onload() {
        // 加载插件设置
        await this.mainController.loadSettings();
        // 注册日历视图
        this.registerView(VIEW_TYPE_CALENDAR, (leaf) => new CalendarView(leaf, this.mainController));

        this.addCommand({
            id: "dust-calendar-active-calendar-view",
            name: "Dust Calendar: 打开日历视图",
            callback: () => {
                this.mainController.activateCalendarView();
            }
        });

        this.addSettingTab(new MainSettingTable(this.mainController));
        this.mainController.activateCalendarView();
    }

    // 关闭插件的时候执行释放资源的操作
    onunload() {

    }
}

