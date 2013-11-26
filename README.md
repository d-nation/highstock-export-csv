highstock-export-csv
==========
This feature allows the user to export the chart data to a csv file. It is built off of the Export-CSV plugin by Torstein Honsi, but has been modified to work with Highstock. It has the optional ability to convert Highstock's x-Axis data to ISO strings and to include/exclude the 'Navigator' series.

The contents of the plugin is located in the javascript file "highstock-export-csv.js". 
This plugin is published under the MIT license, and the license document is included in the repository.

Usage
==========
1. Include the plugin after Highstock and the "exporting" module
2. Add any csv options to the "exporting" object in the chart options object

Options
==========
* csvIncludeNavigator: `true` or `false`
* csvDateAsISO: `true` or `false`
