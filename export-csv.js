/**
 * A small plugin for getting the CSV of a categorized chart
 */
(function (Highcharts) {
    
    // Options
    var itemDelimiter = ',',  // use ';' for direct import to Excel
        lineDelimiter = '\n';
        
    var each = Highcharts.each;
    Highcharts.Chart.prototype.getCSV = function () {
        var xAxis = this.xAxis[0],
            columns = [],
            line,
            tempLine,
            csv = "", 
            row,
            col,
            isStock = this.options._stock,
            includeNavigator = (this.options.exporting.hasOwnProperty("csvIncludeNavigator") && this.options.exporting.csvIncludeNavigator),
            convertDates = (this.options.exporting.hasOwnProperty("csvDateAsISO") && this.options.exporting.csvDateAsISO);

        if (xAxis.categories) {
            columns.push(xAxis.categories);
            columns[0].unshift("");
        }
        each (this.series, function (series) {
            if(isStock){
                //Only include the Navigator series if the option exporting.csvIncludeNavigator is true
                if(series.name != "Navigator" || (includeNavigator && series.name === "Navigator")){
                    columns.push(series.xData.slice());
                    columns[columns.length - 1].unshift(series.name);
                    columns.push(series.yData.slice());
                    columns[columns.length - 1].unshift("");
                }
            }
            else{
                columns.push(series.yData.slice());
                columns[columns.length - 1].unshift(series.name);
            }
        });

        // Transform the columns to CSV
        for (row = 0; row < columns[0].length; row++) {
            line = [];
            for (col = 0; col < columns.length; col++) {
                //If this is a stockchart and the exporting.csvDateAsISO option is true,
                //convert the date integers to iso date strings
                if(isStock && convertDates && row>0 && col%2<1){
                    line.push(new Date(parseInt(columns[col][row])).toISOString());
                }
                else{
                    line.push(columns[col][row]);
                }
            }
            csv += line.join(itemDelimiter) + lineDelimiter;
        }

        return csv;
        };

    // Now we want to add "Download CSV" to the exporting menu. We post the CSV
    // to a simple PHP script that returns it with a content-type header as a 
    // downloadable file.
    // The source code for the PHP script can be viewed at 
    // https://raw.github.com/highslide-software/highcharts.com/master/studies/csv-export/csv.php

    Highcharts.getOptions().exporting.buttons.contextButton.menuItems.push({
        text: 'Download CSV',
        onclick: function () {
            Highcharts.post('http://www.highcharts.com/studies/csv-export/csv.php', {
                csv: this.getCSV()
            });
        }
    }); 
}(Highcharts));


