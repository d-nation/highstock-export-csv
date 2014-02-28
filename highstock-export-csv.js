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
            longestColumn = 0,
            isStock = this.options._stock,
            includeNavigator = (this.options.exporting.hasOwnProperty("csvIncludeNavigator") && this.options.exporting.csvIncludeNavigator),
            convertDates = (this.options.exporting.hasOwnProperty("csvDateAsISO") && this.options.exporting.csvDateAsISO);

        if (xAxis.categories) {
            columns.push(xAxis.categories);
            columns[0].unshift("");
        }
        each (this.series, function (series) {
            console.log(series.xData.length)
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

        //Get the longest column
        for (col=0; col<columns.length; col++) {
            if(columns[col].length > longestColumn){
                longestColumn = columns[col].length;
            }
        }

        // Transform the columns to CSV
        for (row = 0; row < longestColumn; row++) {
            line = [];
            for (col = 0; col < columns.length; col++) {
                //only do something if this column has data at the current row number
                if ( columns[col][row] != undefined ){
                    //If this is a stockchart and the exporting.csvDateAsISO option is true,
                    //convert the date integers to iso date strings
                    if(isStock && convertDates && row>0 && col%2<1){
                        line.push(new Date(parseInt(columns[col][row])).toISOString());
                    }
                    else{
                        line.push(columns[col][row]);
                    }
                }
                else{
                    line.push("");
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
            this.getCSV();
            Highcharts.post('http://www.highcharts.com/studies/csv-export/csv.php', {
                csv: this.getCSV()
            });
        }
    });
}(Highcharts));