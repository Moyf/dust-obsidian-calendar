import {PluginSettingTab, Setting} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import {FontSizeChangeMode, NoteType, TemplatePlugin} from "../../base/enum";
import DustCalendarPlugin from "../../main";
import ImmutableFontSizeSlider from "./ImmutableFontSizeSlider";
import FontSizeChangeModeSelect from "./FontSizeChangeModeSelect";
import QuarterNameModeSelect from "./QuarterNameModeSelect";
import TemplatePluginSelect from "./TemplatePluginSelect";
import NoteTemplate from "./NoteTemplate";
import NotePattern from "./NotePattern";
import DotUpperLimitSelect from "./DotUpperLimitSelect";
import TodoAnnotationModeSelect from "./TodoAnnotationModeSelect";
import WordsPerDotInput from "./WordsPerDotInput";


export default class MainSettingTab extends PluginSettingTab {

    private plugin: DustCalendarPlugin;
    private fontSizeChangeModeSelectRoot: Root | null;
    private immutableFontSizeSliderRoot: Root | null;
    private quarterNameModeSelectRoot: Root | null;
    private wordsPerDotInputRoot: Root | null;
    private dotUpperLimitSelectRoot: Root | null;
    private todoAnnotationModeSelectRoot: Root | null;
    private templatePluginSelectRoot: Root | null;
    private dailyNotePatternRoot: Root | null;
    private dailyNoteTemplateRoot: Root | null;
    private weeklyNotePatternRoot: Root | null;
    private weeklyNoteTemplateRoot: Root | null;
    private monthlyNotePatternRoot: Root | null;
    private monthlyNoteTemplateRoot: Root | null;
    private quarterlyNotePatternRoot: Root | null;
    private quarterlyNoteTemplateRoot: Root | null;
    private yearlyNotePatternRoot: Root | null;
    private yearlyNoteTemplateRoot: Root | null;

    constructor(plugin: DustCalendarPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
        this.fontSizeChangeModeSelectRoot = null;
        this.immutableFontSizeSliderRoot = null;
        this.quarterNameModeSelectRoot = null;
        this.wordsPerDotInputRoot = null;
        this.dotUpperLimitSelectRoot = null;
        this.todoAnnotationModeSelectRoot = null;
        this.templatePluginSelectRoot = null;
        this.dailyNotePatternRoot = null;
        this.dailyNoteTemplateRoot = null;
        this.weeklyNotePatternRoot = null;
        this.weeklyNoteTemplateRoot = null;
        this.monthlyNotePatternRoot = null;
        this.monthlyNoteTemplateRoot = null;
        this.quarterlyNotePatternRoot = null;
        this.quarterlyNoteTemplateRoot = null;
        this.yearlyNotePatternRoot = null;
        this.yearlyNoteTemplateRoot = null;
    }

    display(): any {
        const {containerEl} = this;
        containerEl.empty();
        this.displayShouldDisplayLunarInfoToggle();
        this.displayShouldDisplayHolidayInfo();
        this.displayShouldDisplayWordCount();
        this.displayFontSizeChangeModeSelect();
        this.displayImmutableFontSizeSlider();
        this.displayQuarterNameModeSelect();
        this.displayWordsPerDotInput();
        this.displayDotUpperLimitSelect();
        this.displayTodoAnnotationModeSelect();
        this.displayShouldConfirmBeforeCreatingNoteToggle();
        this.displayTemplatePluginSelect();

        this.displayNoteSetting(NoteType.DAILY, "每日笔记", this.dailyNotePatternRoot, this.dailyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.WEEKLY, "每周笔记", this.weeklyNotePatternRoot, this.weeklyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.MONTHLY, "每月笔记", this.monthlyNotePatternRoot, this.monthlyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.QUARTERLY, "季度笔记", this.quarterlyNotePatternRoot, this.quarterlyNoteTemplateRoot);
        this.displayNoteSetting(NoteType.YEARLY, "年度笔记", this.yearlyNotePatternRoot, this.yearlyNoteTemplateRoot);
    }

    async hide(): Promise<any> {
        await this.plugin.database.saveSetting();
        this.plugin.calendarViewController.forceFlush();
        // this.plugin.flushCalendarView();
        return super.hide();
    }

    private displayFontSizeChangeModeSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.fontSizeChangeModeSelectRoot = createRoot(settingComponent.settingEl);
        this.fontSizeChangeModeSelectRoot.render(
            <FontSizeChangeModeSelect plugin={this.plugin}/>
        );
    }

    private displayShouldDisplayLunarInfoToggle(): void {
        const {containerEl} = this;
        let element = new Setting(containerEl);
        element.setName("是否显示农历信息").setDesc("关闭后不再显示农历月份、日期、节气、节日。");
        element.addToggle(toggle => {
            toggle.setValue(this.plugin.calendarViewController.getShouldDisplayLunarInfo());
            toggle.onChange(async (value) => {
                this.plugin.calendarViewController.setShouldDisplayLunarInfo(value);
            });
        });
    }

    private displayShouldDisplayHolidayInfo(): void {
        const {containerEl} = this;
        let noteOptionElement = new Setting(containerEl);
        noteOptionElement.setName("是否显示调休信息").setDesc("关闭后不再显示调休信息。");
        noteOptionElement.addToggle(toggle => {
            toggle.setValue(this.plugin.calendarViewController.getShouldDisplayHolidayInfo());
            toggle.onChange(async (value) => {
                this.plugin.calendarViewController.setShouldDisplayHolidayInfo(value);
            });
        });
    }

    private displayShouldDisplayWordCount(): void {
        const {containerEl} = this;
        let element = new Setting(containerEl);
        element.setName("是否显示字数统计").setDesc("关闭后不再显示字数统计相关的选项和功能。");
        element.addToggle(toggle => {
            toggle.setValue(this.plugin.database.setting.shouldDisplayWordCount);
            toggle.onChange(async (value) => {
                this.plugin.database.setting.shouldDisplayWordCount = value;
                // 重新加载设置页面以显示或隐藏相关选项
                this.display();
                // 如果开启了字数统计，强制刷新一次以显示统计结果
                if (value) {
                    this.plugin.calendarViewController.forceFlush();
                }
            });
        });
    }

    private displayImmutableFontSizeSlider(): void {

        if (this.plugin.database.setting.fontSizeChangeMode !== FontSizeChangeMode.IMMUTABLE) {
            return;
        }

        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.immutableFontSizeSliderRoot = createRoot(settingComponent.settingEl);
        this.immutableFontSizeSliderRoot.render(
            <ImmutableFontSizeSlider plugin={this.plugin}/>
        );
    }

    private displayQuarterNameModeSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.quarterNameModeSelectRoot = createRoot(settingComponent.settingEl);
        this.quarterNameModeSelectRoot.render(
            <QuarterNameModeSelect plugin={this.plugin}/>
        );
    }

    private displayWordsPerDotInput(): void {
        if (!this.plugin.database.setting.shouldDisplayWordCount) {
            return;
        }

        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.wordsPerDotInputRoot = createRoot(settingComponent.settingEl);
        this.wordsPerDotInputRoot.render(
            <WordsPerDotInput plugin={this.plugin}/>
        );
    }

    private displayDotUpperLimitSelect(): void {
        if (!this.plugin.database.setting.shouldDisplayWordCount) {
            return;
        }

        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.dotUpperLimitSelectRoot = createRoot(settingComponent.settingEl);
        this.dotUpperLimitSelectRoot.render(
            <DotUpperLimitSelect plugin={this.plugin}/>
        );
    }

    private displayTodoAnnotationModeSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.todoAnnotationModeSelectRoot = createRoot(settingComponent.settingEl);
        this.todoAnnotationModeSelectRoot.render(
            <TodoAnnotationModeSelect plugin={this.plugin}/>
        );
    }

    private displayShouldConfirmBeforeCreatingNoteToggle(): void {
        const {containerEl} = this;
        let element = new Setting(containerEl);
        element.setName("创建新笔记之前是否需要确认").setDesc("关闭后不再弹窗提示创建新笔记的信息。");
        element.addToggle(toggle => {
            toggle.setValue(this.plugin.noteController.getShouldConfirmBeforeCreatingNote());
            toggle.onChange(async (value) => {
                this.plugin.noteController.setShouldConfirmBeforeCreatingNote(value);
            });
        });
    }

    private displayTemplatePluginSelect(): void {
        const {containerEl} = this;
        let settingComponent = new Setting(containerEl);
        this.templatePluginSelectRoot = createRoot(settingComponent.settingEl);
        this.templatePluginSelectRoot.render(
            <TemplatePluginSelect plugin={this.plugin}/>
        );
    }

    private displayNoteSetting(noteType: NoteType, title: string, notePatternRoot: Root | null, noteTemplateRoot: Root | null): void {
        const {containerEl} = this;

        const noteOption = this.plugin.noteController.getNoteOption(noteType);

        let noteOptionElement = new Setting(containerEl);
        noteOptionElement.setName(title).setHeading();
        noteOptionElement.addToggle(toggle => {
            toggle.setValue(noteOption);
            toggle.onChange(async (value) => {
                this.plugin.noteController.setNoteOption(noteType, value);
                this.display();
            });
        });

        if (!noteOption) {
            return;
        }

        let notePatternElement = new Setting(containerEl);
        notePatternElement.settingEl.empty();
        notePatternRoot = createRoot(notePatternElement.settingEl);
        notePatternRoot.render(
            <NotePattern plugin={this.plugin} noteType={noteType}/>
        );

        // 是否选择了模板插件
        if (this.plugin.templateController.getTemplatePlugin() === TemplatePlugin.NONE) {
            return;
        }

        // 指定的模板插件是否启用
        if (!this.plugin.templateController.isTemplatePluginEnable()) {
            return;
        }

        let noteTemplateElement = new Setting(containerEl);
        noteTemplateElement.settingEl.empty();
        noteTemplateRoot = createRoot(noteTemplateElement.settingEl);
        noteTemplateRoot.render(
            <NoteTemplate plugin={this.plugin} noteType={noteType}/>
        );
    }
}