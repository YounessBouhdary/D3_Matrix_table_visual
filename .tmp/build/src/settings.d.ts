import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
export declare class HeaderSettings extends FormattingSettingsCard {
    headerColor: formattingSettings.ColorPicker;
    headerThickness: formattingSettings.NumUpDown;
    headerBackgroundColor: formattingSettings.ColorPicker;
    lineAlignment: formattingSettings.AlignmentGroup;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
export declare class DisplayUnitsSettings extends FormattingSettingsCard {
    displayUnitsProperty: formattingSettings.AutoDropdown;
    currencyProperty: formattingSettings.ItemDropdown;
    decimalPlaces: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    visible: boolean;
    slices: (formattingSettings.NumUpDown | formattingSettings.AutoDropdown | formattingSettings.ItemDropdown)[];
}
export declare class BarChartSettings extends formattingSettings.SimpleCard {
    barColor: formattingSettings.ColorPicker;
    blueBarColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
export declare class GridlineSettings extends FormattingSettingsCard {
    enableHorizontalGridline: formattingSettings.ToggleSwitch;
    horizontalGridlineColor: formattingSettings.ColorPicker;
    horizontalGridlineWidth: formattingSettings.NumUpDown;
    enableVerticalGridline: formattingSettings.ToggleSwitch;
    verticalGridlineColor: formattingSettings.ColorPicker;
    verticalGridlineWidth: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
export declare class SubcategorySettings extends FormattingSettingsCard {
    fontFamily: formattingSettings.FontPicker;
    fontSize: formattingSettings.NumUpDown;
    fontColor: formattingSettings.ColorPicker;
    textColor: formattingSettings.ColorPicker;
    indentation: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
export declare class ValuesSettings extends FormattingSettingsCard {
    fontFamily: formattingSettings.FontPicker;
    fontSize: formattingSettings.NumUpDown;
    fontColor: formattingSettings.ColorPicker;
    textColor: formattingSettings.ColorPicker;
    lineAlignment: formattingSettings.AlignmentGroup;
    enablePercentage: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
export declare class CategorySettings extends FormattingSettingsCard {
    fontFamily: formattingSettings.FontPicker;
    TextColor: formattingSettings.ColorPicker;
    fontSize: formattingSettings.NumUpDown;
    fontColor: formattingSettings.ColorPicker;
    enableParentTotal: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
export declare class GrandTotalSettings extends FormattingSettingsCard {
    fontFamily: formattingSettings.FontPicker;
    fontSize: formattingSettings.NumUpDown;
    fontColor: formattingSettings.ColorPicker;
    backgroundColor: formattingSettings.ColorPicker;
    enableGrandTotal: formattingSettings.ToggleSwitch;
    lineAlignment: formattingSettings.AlignmentGroup;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
export declare class VisualSettings extends FormattingSettingsModel {
    subcategorySettings: SubcategorySettings;
    barChartSettings: BarChartSettings;
    headerSettings: HeaderSettings;
    header: HeaderSettings;
    displayUnits: DisplayUnitsSettings;
    gridlineSettings: GridlineSettings;
    categorySettings: CategorySettings;
    grandTotalSettings: GrandTotalSettings;
    valuesSettings: ValuesSettings;
    cards: FormattingSettingsCard[];
}
