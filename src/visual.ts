import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import DataViewCategorical = powerbi.DataViewCategorical;
import * as d3 from 'd3-selection';
import { VisualSettings } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { AppendableSelection, Selection } from "./models/interfaces";
import { format, formatPrefix, max } from "d3";
import { formatLargeNumber } from "./utils/formaters";
import IViewport = powerbi.IViewport;

export class Visual implements IVisual {
    private settings: VisualSettings;
    private container: AppendableSelection<any>
    private table: AppendableSelection<any>
    private thead: AppendableSelection<any>
    private tbody: AppendableSelection<any>
    private formattingSettingsService: FormattingSettingsService;
    private visualSettings: VisualSettings;


    // Define the arc generator here
    private expanded: { [category: string]: boolean } = {};

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        this.settings = new VisualSettings();
        this.container = d3.select(options.element)
            .append('div')
            .attr("class", 'custom-visual-container')

            .style('overflow', 'auto');

        this.table = this.container.append('table')
            .classed('custom-visual-table', true);

        this.thead = this.table.append('thead');
        this.tbody = this.table.append('tbody');
    }


    public update(options: VisualUpdateOptions) {

        // Parse visual settings

        // Remove existing elements from thead and tbody
        this.thead.selectAll('*').remove();
        this.tbody.selectAll('*').remove();

        // Parse visual settings from dataViews
        // Apply styles using the visualSettings object (on-progress)
        // setStyle(this.visualSettings);
        // Extract data from dataViews
        const dataView: DataView = options.dataViews && options.dataViews[0];
        const categorical: DataViewCategorical = dataView && dataView.categorical;
        const categoryField = categorical && categorical.categories && categorical.categories[0];
        const subCategoryField = categorical && categorical.categories && categorical.categories[1];

        // Extract category and subcategory titles
        const categoryTitle = categoryField && categoryField.source.displayName;
        const subCategoryTitle = subCategoryField && subCategoryField.source.displayName;
        // Extract measures
        const measures = categorical && categorical.values;

        // Extract header settings from metadata
        const metadata = options.dataViews && options.dataViews[0].metadata;
        const objects = metadata && metadata.objects;
        this.visualSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualSettings, options.dataViews[0]);
        this.visualSettings.header.headerThickness.value = Math.max(0, this.visualSettings.header.headerThickness.value);
        this.visualSettings.header.headerThickness.value = Math.min(100, this.visualSettings.header.headerThickness.value);
        const headerBackgroundColor = this.visualSettings.header.headerBackgroundColor.value.value;
        const barColor = this.visualSettings.barChartSettings.barColor.value.value;
        const blueBarColor = this.visualSettings.barChartSettings.blueBarColor.value.value;

        // subcategories Font/Size/Color settings !
        const subFontFamily = this.visualSettings.subcategorySettings.fontFamily.value;
        const subFontSize = this.visualSettings.subcategorySettings.fontSize.value;
        const subFontColor = this.visualSettings.subcategorySettings.fontColor.value.value;

        // Values Font/Size/Color settings
        const valuesFontFamily = this.visualSettings.valuesSettings.fontFamily.value;
        const valuesFontSize = this.visualSettings.valuesSettings.fontSize.value;
        const valuesFontColor = this.visualSettings.valuesSettings.fontColor.value.value;
        const valueTextColor = this.visualSettings.valuesSettings.textColor.value.value;
        // Grandvalues Font/Size/Color settings
        //  const grandvaluesFontFamily = this.visualSettings.GrandvaluesSettings.fontFamily.value;
        // const grandvaluesFontSize = this.visualSettings.GrandvaluesSettings.fontSize.value;
        //const grandvaluesFontColor = this.visualSettings.GrandvaluesSettings.fontColor.value.value;

        //  .........................Must Take Form Settings ......................
        const showPercentage = this.visualSettings.valuesSettings.enablePercentage.value;
        const horizontalBorderColor = this.visualSettings.gridlineSettings.horizontalGridlineColor.value.value;
        const verticalBorderColor = this.visualSettings.gridlineSettings.verticalGridlineColor.value.value;
        const isAlternatingColor = false
        const horizontalGridlineWidth = `${this.visualSettings.gridlineSettings.horizontalGridlineWidth.value || 1}px`; // Default width is 1px
        const verticalGridlineWidth = `${this.visualSettings.gridlineSettings.verticalGridlineWidth.value || 1}px`; // Default width is 1px

        //  .........................Must Take Form Settings ......................
        const enableHorizontalGridline = this.visualSettings.gridlineSettings.enableHorizontalGridline.value; //enable horiz grid line
        const enableVerticalGridline = this.visualSettings.gridlineSettings.enableVerticalGridline.value; //enable verti grid line
        // const verticalGridlineWidthStyle = `${this.visualSettings.gridlineSettings.verticalGridlineWidth.value}px solid ${verticalBorderColor}`;
        const indentationValue = this.visualSettings.subcategorySettings.indentation.value;

        // Categories Font/Size/Color
        const categoryFontFamily = this.visualSettings.categorySettings.fontFamily.value;
        const categoryFontSize = this.visualSettings.categorySettings.fontSize.value;
        const categoryFontColor = this.visualSettings.categorySettings.fontColor.value.value;

        // constants related to displaying units/currencies/decimals
        const displayUnit: any = this.visualSettings.displayUnits.displayUnitsProperty.value
        const currency = this.visualSettings.displayUnits.currencyProperty.value;
        const decimalPlaces = this.visualSettings.displayUnits.decimalPlaces.value;

        // Grand Total Font/Size/Color/Background
        const grandTotalFontFamily = this.visualSettings.grandTotalSettings.fontFamily.value;
        const grandTotalFontSize = this.visualSettings.grandTotalSettings.fontSize.value;
        const grandTotalFontColor = this.visualSettings.grandTotalSettings.fontColor.value.value;
        const grandTotalTextColor = this.visualSettings.grandTotalSettings.backgroundColor.value.value;


        const baseValue = measures[0]
        const comparisonValue = measures[1]

        //Categories font color 
        const categoriesTextColor = this.visualSettings.categorySettings.TextColor.value.value; // Retrieve text color setting

        //Categories font color 
        const subCatFontColor = this.visualSettings.subcategorySettings.textColor.value.value;

        // Text Alignement for Headers
        const lineAlignment = this.visualSettings.headerSettings.lineAlignment.value;
        let textAlign = "left"; // Default to left alignment

        // Text Alignement for Cat/SubCat Values
        const lineAlignment2 = this.visualSettings.headerSettings.lineAlignment.value;
        let textAlign2 = "left"; // Default to left alignment


        // Text Alignement for Cat/SubCat Values
        const lineAlignment3 = this.visualSettings.headerSettings.lineAlignment.value;
        let textAlign3 = "left"; // Default to left alignment


        if (lineAlignment === "center") {
            textAlign = "center";
        } else if (lineAlignment === "right") {
            textAlign = "right";
        }


        // Create the header row
        const headerRow = this.thead.append('tr').classed('sticky-header', true);
        headerRow.append('th')
            .text(categoryTitle) // Use only categoryTitle
            .style('color', this.visualSettings.header.headerColor.value.value)
            .style('text-align', this.visualSettings.header.lineAlignment.value)
            .style('font-size', `${this.visualSettings.header.headerThickness.value}px`)
            .style('background-color', headerBackgroundColor);


        measures && measures.forEach(measure => {
            headerRow.append('th')
                .text(measure.source.displayName)
                .style('color', this.visualSettings.header.headerColor.value.value)
                .style('text-align', this.visualSettings.header.lineAlignment.value)
                .style('font-size', `${this.visualSettings.header.headerThickness.value}px`)
                .style('background-color', headerBackgroundColor)
        });

        //link style with format settings and cap objects
        headerRow.append('th')
            .text('Variance')
            .style('text-align', this.visualSettings.header.lineAlignment.value)
            .style('color', this.visualSettings.header.headerColor.value.value)
            .style('font-size', `${this.visualSettings.header.headerThickness.value}px`)
            .style('background-color', headerBackgroundColor)

        headerRow.append('th')
            .text('% Variance')
            .style('text-align', this.visualSettings.header.lineAlignment.value)
            .style('color', this.visualSettings.header.headerColor.value.value)
            .style('font-size', `${this.visualSettings.header.headerThickness.value}px`)
            .style('background-color', headerBackgroundColor)



        // Check if indices are found
        if (!(baseValue !== undefined && comparisonValue !== undefined)) {
            console.error('Actuals or Budget column not found');
            return;
        }

        const combinedData = categoryField && categoryField.values && categoryField.values.map((catValue, index) => {
            // Determine the positions of Actuals and Budget measures
            const actualsIndex = measures.findIndex(measure => measure.source.displayName === 'Actuals');
            const budgetIndex = measures.findIndex(measure => measure.source.displayName === 'Budget');

            // Use these positions to retrieve the actual values dynamically
            let actualValue = baseValue.values[index];
            let budgetValue = comparisonValue.values[index];

            // Use actualsIndex to dynamically get the actual value
            if (actualsIndex !== -1) {
                actualValue = measures[actualsIndex].values[index];
            }

            // Use budgetIndex to dynamically get the budget value
            if (budgetIndex !== -1) {
                budgetValue = measures[budgetIndex].values[index];
            }

            // Convert to number safely
            actualValue = typeof actualValue === 'number' ? actualValue : parseFloat(String(actualValue));
            budgetValue = typeof budgetValue === 'number' ? budgetValue : parseFloat(String(budgetValue));

            // Handle NaN values in Actuals column
            if (isNaN(actualValue)) {
                actualValue = 0; // Replace NaN with 0
            }
            if (isNaN(budgetValue)) {
                budgetValue = 0; // Replace NaN with 0
            }

            const variance = actualValue - budgetValue;
            const percentVariance = actualValue !== 0 ? (variance / actualValue) * 100 : 0;
            const subCatValue = subCategoryField && subCategoryField.values && subCategoryField.values[index];

            return {
                catValue: catValue,
                subCatValue: subCatValue,
                measures: measures && measures.map(measure => measure.values && measure.values[index]),
                variance: variance,
                percentVariance: percentVariance, // Add percent variance to the data object
                index: index
            };
        });




        // Sort the combined data by category then subcategory
        combinedData && combinedData.sort((a, b) => {
            let catCompare = String(a.catValue).localeCompare(String(b.catValue));
            if (catCompare !== 0) {
                return catCompare;
            }
            return String(a.subCatValue).localeCompare(String(b.subCatValue));
        });


        const maxVariance = max(combinedData, (d) => Math.abs(d.variance))

        // Process data to group by category and subcategory
        const processedData = {};
        combinedData && combinedData.forEach(data => {
            const catValueStr = String(data.catValue);
            const subCatValueStr = String(data.subCatValue);

            if (!processedData[catValueStr]) {
                processedData[catValueStr] = {};
            }
            if (!processedData[catValueStr][subCatValueStr]) {
                processedData[catValueStr][subCatValueStr] = {
                    measures: new Array(measures.length).fill(0),
                    variance: 0,
                    percentVariance: 0, // Initialize percentVariance
                    valueForVariance: 0 // Initialize valueForVariance
                };
            }
            data.measures && data.measures.forEach((measure, i) => {
                processedData[catValueStr][subCatValueStr].measures[i] += typeof measure === 'number' ? measure : parseFloat(String(measure));
            });
            processedData[catValueStr][subCatValueStr]
                .variance += data.variance;
            processedData[catValueStr][subCatValueStr]
                .percentVariance += data.percentVariance; // Accumulate percent variance
            processedData[catValueStr][subCatValueStr]
                .valueForVariance += data.variance; // Accumulate value for variance
        });


        //
        // Append rows for each category and subcategory
        Object.entries(processedData).forEach(([catValue, subCategories], index) => {

            const categoryId = `category-${catValue.replace(/\s+/g, '-')}`;

            const categoryRow = this.tbody
                .append('tr')
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')

                .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                .style('font-size', `${categoryFontSize}px`)
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                .style('border-left-width', verticalGridlineWidth)
                .style('background-color', () => {  // this is for alternating color
                    if (isAlternatingColor) {
                        if (index % 2 === 0) {
                            return headerBackgroundColor
                        } else {
                            return "#f1eaea"
                        }
                    } else {
                        return headerBackgroundColor
                    }


                })
            console.log("TextColor value:", this.visualSettings.categorySettings.TextColor.value.value);

            const categoryCell = categoryRow.append('td')
                .style('background-color', categoryFontColor)
                .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                .style('border-bottom-width', horizontalGridlineWidth)
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                .style('border-left-width', verticalGridlineWidth)
                .style('border-bottom-width', horizontalGridlineWidth);

            if (enableVerticalGridline) {
                categoryCell
                    .style('border-right', `1px solid ${verticalBorderColor}`); // Apply vertical gridline style if enabled
            }

            // Check if the current category has subcategories
            const hasSubcategories = Object.keys(subCategories).some(subCatKey => {
                // Assuming that a non-existent subcategory might be represented as 'null' or an empty string
                return subCatKey !== 'null' && subCatKey.trim() !== '';
            });

            categoryCell.on('click', () => {
                if (hasSubcategories) {
                    // Toggle expand/collapse for the category
                    this.expanded[catValue] = !this.expanded[catValue];
                    this.update(options);
                }
            });

            // Append toggle icon if there are subcategories
            if (hasSubcategories) {
                const toggleIcon = categoryCell.append('span')
                    .classed('toggle-icon', true)
                    .classed(categoryId, true)
                    .style("font-family", categoryFontFamily)
                    .style('color', this.visualSettings.categorySettings.TextColor.value.value) // Set the text color style based on the visual setting
                    .html(this.expanded[catValue] ? '▼ ' : '►');
                toggleIcon.classed('collapsed', !this.expanded[catValue]);
            } else {
                // If no subcategories are present, replace toggle
                categoryCell.append('span')
                    .attr("font-family", categoryFontFamily)
                    .classed('no-toggle-icon', true)
                    .style('background-color', categoryFontColor)
                    .style('font-size', `${categoryFontSize}px`)
                    .style('font-family', categoryFontFamily)
                    .style('visibility', 'hidden') // Makes the placeholder invisible, but it still occupies space
                    .html('►');
            }

            categoryCell.append('text')
                .style("font-family", categoryFontFamily)
                .style('color', this.visualSettings.categorySettings.TextColor.value.value)
                .style('font-size', `${categoryFontSize}px`)
                .style('font-family', categoryFontFamily)
                .text(` ${catValue}`);

            categoryCell
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                .style('border-left-width', verticalGridlineWidth)
                .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                .style('font-size', `${categoryFontSize}px`)
                .style('border-bottom-width', horizontalGridlineWidth);
            // Calculate and append category totals
            // Calculate and append category totals
            const categoryTotals = new Array(measures.length).fill(0);
            let categoryVariance = 0;
            let totalActuals = 0; // Initialize total actuals

            Object.values(subCategories).forEach(data => {
                data.measures && data.measures.forEach((measure, i) => {
                    categoryTotals[i] += measure;
                    if (i === 0) { // Assuming the first measure is the actual value
                        totalActuals += measure;
                    }
                });
                categoryVariance += data.variance;
            });

            const categoryPercentVariance = totalActuals !== 0 ? (categoryVariance / totalActuals) * 100 : 0;

            const showRowSubtotals = this.visualSettings.categorySettings.enableParentTotal.value; // Value from the settings
            categoryRow.selectAll('td:not(:first-child)').remove(); // Remove existing cells except the first one
            categoryTotals && categoryTotals.forEach(total => {

                if (lineAlignment === "center") {
                    textAlign = "center";
                } else if (lineAlignment === "right") {
                    textAlign = "right";
                }
                if (showRowSubtotals || !this.expanded[catValue]) {

                    categoryRow.append('td')
                        .style('text-align', this.visualSettings.valuesSettings.lineAlignment.value)
                        .style('font-family', valuesFontFamily)
                        .style('font-size', `${valuesFontSize}px`)
                        .style('background-color', valuesFontColor)
                        .style('color', valueTextColor)
                        .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                        .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                        .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                        .classed('budget-actual-cell', true) // Apply the class to center the text
                        .text(formatLargeNumber(total, displayUnit, currency.value.toString(), decimalPlaces))
                        .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                        .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                        .style('border-left-width', verticalGridlineWidth);
                }

            });




            const categoryVarianceBarWidth = Math.abs(categoryVariance) / maxVariance * 25; // Calculate width as a percentage of the maxVariance



            const categoryVarianceBarOffset = categoryVariance >= 0 ? 50 : 50 - categoryVarianceBarWidth; // Calculate offset based on variance sign


            if (showRowSubtotals || !this.expanded[catValue]) {
                // Append category variance with chart and value
                const categoryVarianceCell = categoryRow.append('td')
                    .classed('budget-actual-cell', true)// Apply the class to center the text
                    .style('font-family', valuesFontFamily)
                    .style('font-size', `${valuesFontSize}px`)
                    .style('background-color', valuesFontColor)
                    .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                    .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                    .style('border-bottom-width', horizontalGridlineWidth)
                    .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                    .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                    .style('border-left-width', verticalGridlineWidth);

                // Set the border-right-width property

                const categoryVarianceSvg = categoryVarianceCell
                    .append('svg').attr('width', '100%').attr('height', '20px')
                    .style('font-size', `${valuesFontSize}px`)

                categoryVarianceSvg.append('rect')
                    .attr('x', `${categoryVarianceBarOffset}%`)
                    .attr('width', `${categoryVarianceBarWidth}%`)
                    .attr('height', '100%')
                    .attr('class', categoryVariance >= 0 ? 'blue-bar' : 'red-bar')
                this.table.selectAll('.red-bar').style('fill', barColor);
                this.table.selectAll('.blue-bar').style('fill', blueBarColor);

                // Append the text for the variance value
                categoryVarianceSvg.append('text')
                    .attr('x', categoryVariance < 0 ? `${categoryVarianceBarOffset - 5}%` : `${categoryVarianceBarOffset + categoryVarianceBarWidth + 5}%`)
                    .attr('y', '50%')
                    .attr('dy', '0.35em')
                    .attr('text-anchor', categoryVariance < 0 ? 'end' : 'start')
                    .attr('fill', categoryVariance >= 0 ? blueBarColor : barColor) // Dynamically set fill color
                    .style('background-color', headerBackgroundColor)
                    .text(formatLargeNumber(categoryVariance, displayUnit, currency.value.toString(), decimalPlaces))
                    .style('font-size', `${valuesFontSize}px`);

                // Append percent variance with custom font style
                categoryRow.append('td')
                    .classed('budget-actual-cell', true)
                    .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                    .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                    .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                    .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                    .style('border-left-width', verticalGridlineWidth)
                    .style('font-family', categoryFontFamily)
                    // .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                    .style('font-family', valuesFontFamily)
                    .style('text-align', this.visualSettings.valuesSettings.lineAlignment.value)
                    .style('font-size', `${valuesFontSize}px`)
                    .style('background-color', valuesFontColor)
                    .style('color', function () {
                        return categoryPercentVariance >= 0 ? blueBarColor : barColor; // Dynamic color based on percentage variance
                    })
                    .text(() => {
                        if (showPercentage) {

                            return `${Math.round(categoryPercentVariance)}%`
                        } else {
                            return (categoryPercentVariance / 100).toFixed(2)
                        }
                    })
                    .style('font-size', `${valuesFontSize}px`)
                categoryVarianceSvg.append('line')
                    .attr('x1', '50%') // x position of the start of the line
                    .attr('y1', 0) // y position of the start of the line (top of the SVG)
                    .attr('x2', '50%') // x position of the end of the line
                    .attr('y2', '100%') // y position of the end of the line (bottom of the SVG)
                    .attr('stroke', 'black') // Stroke color
                    .attr('stroke-width', 4); // Stroke width
            }
            // Append subcategory rows
            Object.entries(subCategories).forEach(([subCatValue, data]) => {
                // Check if the subcategory value is null or empty
                if (subCatValue === 'null' || subCatValue === null || subCatValue === '') {
                    subCatValue = ''; // Replace null or empty with blank
                    return; // Skip creating the row and toggle for non-existent subcategories
                }

                const subCategoryId = `subcategory-${subCatValue.replace(/\s+/g, '-')}`;
                const subCategoryRow =
                    this.tbody.append('tr')

                        .attr("class", `subcategory-row ${categoryId} ${subCategoryId}`)
                        .style('display', this.expanded[catValue] ? 'table-row' : 'none')
                        .style('background-color', subFontColor)
                        .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                        .style('border-bottom-width', horizontalGridlineWidth)
                        .style('font-size', `${subFontSize}px`)
                        .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                        .style('font-family', subFontFamily)
                        .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                        .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                        .style('border-left-width', verticalGridlineWidth);


                subCategoryRow.append('td')
                    .style('background-color', subFontColor)
                    .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                    .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                    .style('border-bottom-width', horizontalGridlineWidth)
                    .style('font-family', subFontFamily)
                    .style('font-size', `${subFontSize}px`)
                    .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                    .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                    .style('border-left-width', verticalGridlineWidth)
                    .style("padding-left", `${indentationValue}px`)
                    .style('color', subCatFontColor)
                    .text(`${subCatValue}`);



                data.measures && data.measures.forEach((measure, index) => {
                    // Replace blank 'Sum of Actuals' values with 0
                    if ((measure === '' || measure === null)) {
                        measure = 0;
                    }
                    subCategoryRow.append('td')
                        .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                        .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                        .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                        .style('font-family', valuesFontFamily)
                        .style('text-align', this.visualSettings.valuesSettings.lineAlignment.value)
                        .style('font-size', `${valuesFontSize}px`)
                        .style('background-color', valuesFontColor)
                        .style('color', valueTextColor)
                        .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                        //     .style('border-right', verticalGridlineWidthStyle) // Apply vertical gridline width style
                        .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                        .style('border-left-width', verticalGridlineWidth)
                        .text(formatLargeNumber(measure, displayUnit, currency.value.toString(), decimalPlaces))
                        .classed('budget-actual-cell', true);
                });



                // Calculate variance for subcategory
                let subCategoryVariance = data.variance !== null ? data.variance : categoryVariance;
                let subCategoryPercentVariance = data.percentVariance !== null ? data.percentVariance : categoryPercentVariance;

                // Append variance with bar chart and value
                const varianceCell = subCategoryRow.append('td')
                    .style('background-color', valuesFontColor)
                    .style('text-align', this.visualSettings.valuesSettings.lineAlignment.value)
                    .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                    .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                    .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                    .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                    //     .style('border-right', verticalGridlineWidthStyle) // Apply vertical gridline width style
                    .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                    .style('border-left-width', verticalGridlineWidth)
                const svg = varianceCell.append('svg')
                    .attr('width', '100%')
                    .attr('height', '20px');
                const barWidth = Math.abs(subCategoryVariance) / maxVariance * 25; // Calculate width as a percentage of the maxVariance
                const barOffset = subCategoryVariance >= 0 ? 50 : 50 - barWidth; // Calculate offset based on variance sign

                // Append the vertical line
                svg.append('line')
                    .attr('x1', '50%') // x position of the start of the line
                    .attr('y1', 0) // y position of the start of the line (top of the SVG)
                    .attr('x2', '50%') // x position of the end of the line
                    .attr('y2', '100%') // y position of the end of the line (bottom of the SVG)
                    .attr('stroke', 'black') // Stroke color
                    .attr('stroke-width', 4); // Stroke width (increase for a thicker line)

                // Append the rectangle for the bar chart
                svg.append('rect')
                    .attr('x', `${barOffset}%`)
                    .attr('width', `${barWidth}%`)
                    .attr('height', '100%')
                    .attr('class', subCategoryVariance >= 0 ? 'blue-bar' : 'red-bar')
                    .attr("fill", () => {
                        return subCategoryVariance >= 0 ? blueBarColor : barColor; // Use the same variables as used for the bars
                    })


                // Append the text for the variance value
                const textOffset = 3; // Adjust this value to fine-tune the text position
                svg.append('text')
                    .style('font-family', valuesFontFamily)
                    .attr('x', subCategoryVariance >= 0 ? `${barOffset + barWidth + textOffset}%` : `${barOffset - textOffset}%`)
                    .attr('y', '50%')
                    .attr('dy', '0.35em')
                    .attr('text-anchor', subCategoryVariance >= 0 ? 'start' : 'end')
                    .attr('fill', subCategoryVariance >= 0 ? blueBarColor : barColor) // Dynamically set color
                    .text(formatLargeNumber(subCategoryVariance, displayUnit, currency.value.toString(), decimalPlaces))
                    .style('background-color', valuesFontColor)
                    .style('font-size', `${valuesFontSize}px`);

                // Append % Variance with custom font style
                subCategoryRow.append('td')
                    .classed('budget-actual-cell', true)
                    .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                    .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                    .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                    .style('border-right-width', verticalGridlineWidth)
                    .style('border-left-width', verticalGridlineWidth)
                    .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                    //     .style('border-right', verticalGridlineWidthStyle) // Apply vertical gridline width style
                    .style('font-family', valuesFontFamily)
                    .style('text-align', this.visualSettings.valuesSettings.lineAlignment.value)
                    .style('font-size', `${valuesFontSize}px`)
                    .style('background-color', valuesFontColor)
                    .style('color', function () { // Use a function to dynamically set the color
                        return subCategoryVariance >= 0 ? blueBarColor : barColor; // Use the same variables as used for the bars
                    })
                    .text(() => {
                        if (showPercentage) {
                            return `${Math.round(subCategoryPercentVariance)}%`
                        } else {
                            return (subCategoryPercentVariance / 100).toFixed(2)
                        }
                    });
                // Align subcategory values to the right if the parent category item is blue
                if (data.isBlue) {
                    subCategoryRow.classed('blue-parent-category', true);
                }
            });
        });

        const enableGrandTotal = this.visualSettings.grandTotalSettings.enableGrandTotal.value; // enable grandtotalrow

        if (enableGrandTotal) {
            if (lineAlignment3 === "center") {
                textAlign3 = "center";
            } else if (lineAlignment3 === "right") {
                textAlign3 = "right";
            }
            // Add grand total row
            const grandTotalRow = this.tbody.append('tr')
                .classed('grand-total-row', true)
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                //  .style('background-color', grandTotalBackgroundColor)
                .style('font-size', `${grandTotalFontSize}px`)
                .style('text-align', this.visualSettings.grandTotalSettings.lineAlignment.value)
                .style('font-family', grandTotalFontFamily);
            grandTotalRow.append('td')
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                .style('text-align', this.visualSettings.grandTotalSettings.lineAlignment.value)
                .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                .style('color', grandTotalTextColor)
                .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                .style('border-left-width', verticalGridlineWidth)
                //.style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                // .style('border-right', verticalGridlineWidthStyle) // Apply vertical gridline width style
                .classed('budget-actual-cell', true) // Apply the class to center the text
                .text('Grand Total')
                .style('font-size', `${grandTotalFontSize}px`)
                .style('background-color', grandTotalFontColor)
                .style('font-family', grandTotalFontFamily);
            const grandTotalValues = new Array(measures.length).fill(0);
            let grandTotalVariance = 0;
            let grandTotalPercentVariance = 0; // Initialize grand total percent variance

            combinedData && combinedData.forEach(data => {
                data.measures && data.measures.forEach((measure, i) => {
                    grandTotalValues[i] += measure;
                });
            });

            // Calculate grand total % Variance
            const grandTotalActual = grandTotalValues[0]; // Assuming the first measure is the actual value for the grand total row
            const grandTotalBudget = grandTotalValues[1]; // Assuming the second measure is the budget value for the grand total row
            grandTotalVariance = grandTotalActual - grandTotalBudget;
            grandTotalPercentVariance = grandTotalBudget !== 0 ? ((grandTotalActual / grandTotalBudget) - 1) * 100 : 0;

            grandTotalValues && grandTotalValues.forEach(total => {
                grandTotalRow.append('td')
                    .style('background-color', grandTotalFontColor)
                    .style('color', grandTotalTextColor)
                    .style('text-align', this.visualSettings.grandTotalSettings.lineAlignment.value)
                    .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                    .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                    .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                    .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                    .style('border-left-width', verticalGridlineWidth)
                    .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                    .classed('budget-actual-cell', true)
                    //    .style('font-family', grandvaluesFontFamily)
                    .style('font-size', `${grandTotalFontSize}px`)
                    .text(formatLargeNumber(total, displayUnit, currency.value.toString(), decimalPlaces));
            });
            // Append grand total variance with chart and value
            const grandTotalVarianceCell = grandTotalRow
                .append('td')
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none') // only enable !

                .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                // not useful   .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                .style('border-right-width', verticalGridlineWidth) // right vert-line width
                //  .style('border-left-width', verticalGridlineWidth)
                .style('background-color', grandTotalFontColor)
                .style('color', grandTotalTextColor)
                .style('font-size', `${grandTotalFontSize}px`)
                .style('font-family', grandTotalFontFamily);
            const grandTotalVarianceSvg = grandTotalVarianceCell.append('svg')
                .attr('width', '100%')
                .attr('height', '20px');
            const grandTotalVarianceBarWidth = Math.abs(grandTotalVariance) / maxVariance * 25; // Calculate width as a percentage of the maxVariance
            const grandTotalVarianceBarOffset = grandTotalVariance >= 0 ? 50 : 50 - grandTotalVarianceBarWidth; // Calculate offset based on variance sign

            grandTotalVarianceSvg.append('rect')
                .attr('x', `${grandTotalVarianceBarOffset}%`)
                .attr('width', `${grandTotalVarianceBarWidth}%`)
                .attr('height', '100%')
                .attr('class', grandTotalVariance >= 0 ? 'blue-bar' : 'red-bar')
                .attr("fill", () => {
                    return grandTotalVariance >= 0 ? blueBarColor : barColor
                })


            grandTotalVarianceSvg.append('text')
                .attr('x', grandTotalVariance < 0 ? `${grandTotalVarianceBarOffset - 5}%` : `${grandTotalVarianceBarOffset + grandTotalVarianceBarWidth + 5}%`)
                .attr('y', '50%')
                .attr('dy', '0.35em')
                .attr('text-anchor', grandTotalVariance < 0 ? 'end' : 'start')
                .attr('fill', grandTotalVariance >= 0 ? blueBarColor : barColor) // Dynamically set color
                //   .style('font-family', grandvaluesFontFamily)
                .style('background-color', grandTotalFontColor)
                .style('color', grandTotalTextColor)
                .style('font-size', `${grandTotalFontSize}px`)
                .text(formatLargeNumber(grandTotalVariance, displayUnit, currency.value.toString(), decimalPlaces));

            // Append percent variance with custom font style
            grandTotalRow.append('td')
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                .style('font-size', `${grandTotalFontSize}px`)
                .classed('budget-actual-cell', true)
                .style('font-size', `${grandTotalFontSize}px`)
                .style('text-align', this.visualSettings.grandTotalSettings.lineAlignment.value)
                .style('background-color', grandTotalFontColor)
                .style('color', grandTotalTextColor)
                .style("border-bottom", `1px solid ${horizontalBorderColor}`)
                .style('border-bottom', enableHorizontalGridline ? `1px solid ${horizontalBorderColor}` : 'none') // Conditionally set border-bottom
                .style('border-bottom-width', horizontalGridlineWidth) // Set the border-bottom-width property
                .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                .style('border-left-width', verticalGridlineWidth) // Set the border-left-width property
                .style('color', grandTotalPercentVariance >= 0 ? blueBarColor : barColor) // Dynamically set color
                .text(() => {
                    if (showPercentage) {
                        return `${Math.round(grandTotalPercentVariance)}%`;
                    } else {
                        return (grandTotalPercentVariance / 100).toFixed(2);
                    }
                });
            if (enableVerticalGridline) {
                grandTotalRow
                    .style('border-right', `1px solid ${verticalBorderColor}`)
                    .style('border-right', enableVerticalGridline ? `1px solid ${verticalBorderColor}` : 'none')
                    .style('border-right-width', verticalGridlineWidth) // Set the border-right-width property
                    .style('border-left-width', verticalGridlineWidth); // Apply vertical gridline style if enabled
            }

            grandTotalVarianceSvg.append('line')
                .attr('x1', '50%') // x position of the start of the line
                .attr('y1', 0) // y position of the start of the line (top of the SVG)
                .attr('x2', '50%') // x position of the end of the line
                .attr('y2', '100%') // y position of the end of the line (bottom of the SVG)
                .attr('stroke', 'black') // Stroke color
                .attr('stroke-width', 4); // Stroke width



        }

    }

    applyStyles() {
        throw new Error("Method not implemented.");
    }

    updateResizeOptions(viewport: powerbi.IViewport) {
        throw new Error("Method not implemented.");
    }


    //Format Model 5.3.0


    private calculateVariance(actualValue: powerbi.PrimitiveValue, budgetValue: powerbi.PrimitiveValue) {
        const actual = actualValue !== null && actualValue !== undefined ? Number(actualValue) : 0;
        const budget = budgetValue !== null && budgetValue !== undefined ? Number(budgetValue) : 0;
        const variance = actual - budget;
        const percentVariance = budget !== 0 ? ((actual / budget) - 1) * 100 : 0;
        return { variance, percentVariance };
    }


    public enableGrandTotal: boolean = true; // Default value, based on the actual setting value
    public showRowSubtotals: boolean = true;


    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.visualSettings);
    }

}
