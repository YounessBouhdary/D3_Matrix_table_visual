# PowerBI advanced Matrix Table Visual #
# Power BI Custom Visual: D3 Matrix Financial Table
## Pbiviz api : 5.3.0


## ------------------------------------------Documentation references----------------------------------------

a) Overview :

The MatrixTable visual is a custom Power BI visual developed using D3.js, TypeScript, and the
PBIVIZ API. It provides a customizable financial table for displaying data in a matrix format.

b) Visual Information :

Capabilities.json file:

### Data Roles

Category: Used for grouping data.
Base Value Index: Represents the base value for comparison.
Comparison Value Index: Represents the value for comparison.

### Objects

Header Settings:

Column Headers: Customizes the column headers.
Header Background Default Color: Sets the default background color for headers.
- Privileges
WebAccess
LocalStorage

### Data View Mappings

Categorical:

Categories: Uses the "category" role with a data reduction algorithm.
Values: Binds to "baseValueIndex" and "comparisonValueIndex."
Settings.ts file:
The settings file (settings.ts) contains TypeScript classes that define the configuration options
for the MatrixTable visual in Power BI. These settings include formatting options, header
settings, and index settings for base and comparison values.

### Classes

• VisualSettings: Extends DataViewObjectsParser and defines the overall settings for the
visual, including data point settings, number format, header settings, and format options.
• dataPointSettings: Contains formatting options for data points, such as display units,
decimal places, and currency symbol.
• formatOptionSettings: Defines format options for the visual, such as the format type.
• HeaderSettings: Contains properties for customizing column headers, such as the budget
header and header background color.

### Properties

• dataPoint: Instance of dataPointSettings for data point formatting.
• numberFormat: Specifies the default number format.
• headerSettings: Instance of HeaderSettings for customizing column headers.
• formatOptions: Instance of formatOptionSettings for format type options.
• baseValueIndex: Index of the base value column.
• comparisonValueIndex: Index of the comparison value column.
• showPercentageDifference: Option to show or hide the percentage difference column.

# Usage

Edit or modify the settings file to customize the visual's appearance and behavior according to
their requirements. The settings can be adjusted to change the formatting, layout, and
functionality of the MatrixTable visual in Power BI.

-----------------------------------------Installation:-----------------------------------------------

### To run the visual, follow these steps:
1) Clone the repository project file.
2) Open the project in your preferred development environment.
3) Install the necessary dependencies (npm install).
4) Run the project using “pbiviz start” command
5) Build the project “pbiviz package”.
6) Import the visual into Power BI.
- To use the visual, add it to your Power BI report canvas and configure it using the
provided settings in Power BI.
