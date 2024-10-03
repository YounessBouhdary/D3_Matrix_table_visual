//
//
//
// export function dataPreprocessing(firstMeasure:any, secondMeasure:any){
//
//     const combinedData = categoryField && categoryField.values && categoryField.values.map((catValue, index) => {
//         let actualValue = measures[actualsIndex].values[index];
//         let budgetValue = measures[budgetIndex].values[index];
//         // Convert to number safely
//         actualValue = typeof actualValue === 'number' ? actualValue : parseFloat(String(actualValue));
//         budgetValue = typeof budgetValue === 'number' ? budgetValue : parseFloat(String(budgetValue));
//
//         // Handle NaN values in Actuals column
//         if (isNaN(actualValue)) {
//             actualValue = 0; // Replace NaN with 0
//         }
//
//         const variance = actualValue - budgetValue;
//         const percentVariance = budgetValue !== 0 ? ((actualValue / budgetValue) - 1) * 100 : 0; // Calculate percent variance
//         const subCatValue = subCategoryField && subCategoryField.values && subCategoryField.values[index];
//
//
//         return {
//             catValue: catValue,
//             subCatValue: subCatValue,
//             measures: measures && measures.map(measure => measure.values && measure.values[index]),
//             variance: variance,
//             percentVariance: percentVariance, // Add percent variance to the data object
//             index: index
//         };
//     });
// }
