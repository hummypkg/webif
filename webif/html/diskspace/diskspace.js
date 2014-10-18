//$(function () {

$('#tbdiskpie')
    .hover(function(e) { e.stopPropagation(); $(this).stop(true, true); })
    .highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
	    backgroundColor: 'transparent',
            plotShadow: false,
	    spacing: [0, 0, 0, 0],
	    className: 'tbdiskpie',
//	    height: 150, width: 150,
	    events: {
		click: function(e) {
			window.location = '/diag/dspace/index.jim';
		}
	    }
        },
	// Blue #7cb5ec, Green #90ed7d
	colors:
	  Highcharts.map(['#7cb5ec', '#e4d354', '#cccccc'], function(color) {
		return {
		    radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		    stops: [
			[0, color],
			[1, Highcharts.Color(color).brighten(-0.3).get('rgb')]
		    ]
		};
	}),
	title: { text: '' },
	credits: false,
        plotOptions: {
            pie: {
		animation: { duration: 300 },
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
		shadow: false,
		borderWidth: 0,
		states: { hover: false }
            }
        },
	tooltip: {
		enabled: true,
		formatter: function() {
			return this.point.name + ': ' + this.point.pretty;
		}
	},
        series: [{
            type: 'pie',
            name: 'Disk Space',
            data: diskspace_data
        }]
    });

//});

