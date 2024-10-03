import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private settings;
    private container;
    private table;
    private thead;
    private tbody;
    private formattingSettingsService;
    private visualSettings;
    private expanded;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    applyStyles(): void;
    updateResizeOptions(viewport: powerbi.IViewport): void;
    private calculateVariance;
    enableGrandTotal: boolean;
    showRowSubtotals: boolean;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
