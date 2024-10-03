"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class HeaderSettings extends FormattingSettingsCard {
    public headerColor = new formattingSettings.ColorPicker({
        name: "headerColor",
        displayName: "Font Color",
        value: { value: "#000000" },
        visible: true
    });

    public headerThickness = new formattingSettings.NumUpDown({
        name: "headerThickness",
        displayName: "Font Size",
        value: 20,
        visible: true
    });
    public headerBackgroundColor = new formattingSettings.ColorPicker({
        name: "headerBackgroundColor",
        displayName: "Background Color",
        value: { value: "#ffffff" },
        visible: true
    });

    public lineAlignment = new formattingSettings.AlignmentGroup({
        name: "lineAlignment",
        displayName: "Line Alignment",
        value: "left",
        visible: true,
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    });

    public name: string = "header";
    public displayName: string = "Header";
    public visible: boolean = true;
    public slices: FormattingSettingsSlice[] = [this.headerColor, this.headerThickness, this.headerBackgroundColor, this.lineAlignment];
}

// defining the DisplayUnitsSettings class for display units-specific properties
export class DisplayUnitsSettings extends FormattingSettingsCard {
    public displayUnitsProperty = new formattingSettings.AutoDropdown({
        name: "displayUnitsProperty",
        displayName: "Display Units",
        value: "None", // Default display units
        visible: true,

    });
    public currencyProperty = new formattingSettings.ItemDropdown({
        name: "currencyProperty",
        displayName: "Currency",
        value: {
            value: '$',
            displayName: "$"
        },
        visible: true,
        items: [
            { value: '$', displayName: "$" },
            { value: '€', displayName: "€" },
            { value: '£', displayName: "£" },
            { value: '', displayName: "None" },

        ],
    });
    public decimalPlaces = new formattingSettings.NumUpDown({
        name: "decimalPlaces",
        displayName: "Decimal Places",
        value: 0, // Default value
        visible: true
    });
    public name = "displayUnits";
    public displayName = "Display Units";
    public visible = true;
    public slices = [this.displayUnitsProperty, this.currencyProperty, this.decimalPlaces];

}

export class BarChartSettings extends formattingSettings.SimpleCard {
    public barColor = new formattingSettings.ColorPicker({
        name: "barColor",
        displayName: "Negative Bar Color Settings ",
        value: { value: "#01B8AA" }, // Correctly formatted default color value
        visible: true
    });

    public blueBarColor = new formattingSettings.ColorPicker({
        name: "blueBarColor",
        displayName: "Positive Bar Color Settings",
        value: { value: "#0000FF" }, // Default blue color
        visible: true
    });

    public name: string = "barChartSettings";
    public displayName: string = "Bar Chart Settings";
    public visible: boolean = true;
    public slices: FormattingSettingsSlice[] = [this.barColor, this.blueBarColor];
}




export class GridlineSettings extends FormattingSettingsCard {
    public enableHorizontalGridline = new formattingSettings.ToggleSwitch({
        name: "enableHorizontalGridline",
        displayName: "Enable Horizontal Gridline",
        value: true,
        visible: true
    });

    public horizontalGridlineColor = new formattingSettings.ColorPicker({
        name: "horizontalGridlineColor",
        displayName: "Horizontal Gridline Color",
        value: { value: "#0000FF" }, // Default blue color
        visible: true
    });

    public horizontalGridlineWidth = new formattingSettings.NumUpDown({
        name: "horizontalGridlineWidth",
        displayName: "Horizontal Gridline Width",
        value: 1,
        visible: true
    });

    public enableVerticalGridline = new formattingSettings.ToggleSwitch({
        name: "enableVerticalGridline",
        displayName: "Enable Vertical Gridline",
        value: true,
        visible: true
    });

    public verticalGridlineColor = new formattingSettings.ColorPicker({
        name: "verticalGridlineColor",
        displayName: "Vertical Gridline Color",
        value: { value: "#0000FF" }, // Default blue color
        visible: true
    });

    public verticalGridlineWidth = new formattingSettings.NumUpDown({
        name: "verticalGridlineWidth",
        displayName: "Vertical Gridline Width",
        value: 1,
        visible: true
    });

    public name: string = "gridline";
    public displayName: string = "Gridline Settings";
    public visible: boolean = true;
    public slices: FormattingSettingsSlice[] = [
        this.enableHorizontalGridline,
        this.horizontalGridlineColor,
        this.horizontalGridlineWidth,
        this.enableVerticalGridline,
        this.verticalGridlineColor,
        this.verticalGridlineWidth
    ];
}

export class SubcategorySettings extends FormattingSettingsCard {
    public fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font Family",
        value: { value: "Arial" }, // Default font family
        visible: true
    });

    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 12, // Default font size
        visible: true
    });

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }, // Default font color
        visible: true
    });
    public textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Text Color",
        value: { value: "#000000" }, // Default text color
        visible: true
    });
    public indentation = new formattingSettings.NumUpDown({
        name: "indentation",
        displayName: "Indentation",
        value: 20, // Default value
        visible: true
    });
    public name: string = "subcategorySettings";
    public displayName: string = "Subcategory Settings";
    public visible: boolean = true;
    public slices: FormattingSettingsSlice[] = [this.fontFamily, this.fontSize, this.fontColor, this.textColor, this.indentation];
}
export class ValuesSettings extends FormattingSettingsCard {
    public fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font Family",
        value: { value: "Arial" }, // Default font family
        visible: true
    });

    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 12, // Default font size
        visible: true
    });

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }, // Default font color
        visible: true
    });
    public textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Text Color",
        value: { value: "#000000" }, // Default text color
        visible: true
    });

    public lineAlignment = new formattingSettings.AlignmentGroup({
        name: "lineAlignment",
        displayName: "Line Alignment",
        value: "left",
        visible: true,
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    });
    public enablePercentage = new formattingSettings.ToggleSwitch({
        name: "enablePercentage",
        displayName: "Enable Percentage",
        value: false, // Default value
        visible: true
    });
    public name: string = "valuesSettings";
    public displayName: string = "Values Settings";
    public visible: boolean = true;
    public slices: FormattingSettingsSlice[] = [this.fontFamily, this.fontSize, this.fontColor, this.textColor,this.lineAlignment, this.enablePercentage];
}
export class CategorySettings extends FormattingSettingsCard {
    public fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font Family",
        value: { value: "Arial" }, // Default font family
        visible: true
    });

    public TextColor = new formattingSettings.ColorPicker({
        name: "TextColor",
        displayName: " Font Color",
        value: { value: "#FFFFFF" }, // Default text color
        visible: true
    });

    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 12, // Default font size
        visible: true
    });

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }, // Default font color
        visible: true
    });
    public enableParentTotal = new formattingSettings.ToggleSwitch({
        name: "enableParentTotal",
        displayName: "Enable Parent Total",
        value: true,
        visible: true
    });

    public name: string = "categorySettings";
    public displayName: string = "Category Settings";
    public visible: boolean = true;
    public slices: FormattingSettingsSlice[] = [this.fontFamily, this.fontSize, this.fontColor, this.TextColor, this.enableParentTotal];
}



  

export class GrandTotalSettings extends FormattingSettingsCard {
    public fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font Family",
        value: { value: "Arial" }, // Default font family
        visible: true
    });

    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 12, // Default font size
        visible: true
    });

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }, // Default font color
        visible: true
    });

    public backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Font Color",
        value: { value: "#FFFFFF" }, // Default background color
        visible: true
    });
    public enableGrandTotal = new formattingSettings.ToggleSwitch({
        name: "enableGrandTotal",
        displayName: "Enable Grand Total",
        value: true,
        visible: true
    });
    public lineAlignment = new formattingSettings.AlignmentGroup({
        name: "lineAlignment",
        displayName: "Line Alignment",
        value: "left",
        visible: true,
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    });
    public name: string = "grandTotalSettings";
    public displayName: string = "Grand Total Settings";
    public visible: boolean = true;
    public slices: FormattingSettingsSlice[] = [this.fontFamily, this.fontSize, this.fontColor, this.backgroundColor, this.enableGrandTotal,this.lineAlignment];
}

export class VisualSettings extends FormattingSettingsModel {
    public subcategorySettings: SubcategorySettings = new SubcategorySettings();
    public barChartSettings: BarChartSettings = new BarChartSettings(); // Include corrected BarChartSettings
    public headerSettings: HeaderSettings = new HeaderSettings();
    public header: HeaderSettings = new HeaderSettings();
    public displayUnits: DisplayUnitsSettings = new DisplayUnitsSettings(); // Instantiate DisplayUnitsSettings
    public gridlineSettings: GridlineSettings = new GridlineSettings(); // Add GridlineSettings instance
    public categorySettings: CategorySettings = new CategorySettings();
    public grandTotalSettings: GrandTotalSettings = new GrandTotalSettings();
    public valuesSettings: ValuesSettings = new ValuesSettings();
   // public GrandvaluesSettings: TotalValuesSettings = new TotalValuesSettings(); // Add TotalValuesSettings instance

    public cards: FormattingSettingsCard[] = [
        this.header,
        this.categorySettings,
        this.subcategorySettings,
        this.grandTotalSettings,
        this.displayUnits,
        this.barChartSettings,
        this.gridlineSettings,
        this.gridlineSettings,
        this.valuesSettings
       // this.GrandvaluesSettings

    ];

}
















