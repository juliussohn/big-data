var color_1 = "#4D7EA8"
var color_2 = "#D1340D"

$(document).ready(function() {
    resizeWindow()
    createCanvas()
    $(window).resize(function() {
        resizeWindow();
    })
    createIconChart();
    createGrowthChart();
    data_counter = setInterval(dataCounter, 1000 / 15);
    $(".toggle-menu a").click(function(e) {
        e.preventDefault();
        $(this).closest(".top-bar").toggleClass("expanded");
    })

   
});
/**
 *  resize header to fullscreeen
 **/
function resizeWindow() {
    wh = $(window).height();
    ww = $(window).width();
    tbh = $(".top-bar").height();
    $(".header").height(wh - tbh);
    $(".header").width(ww)
}
/**
 *   calculates amount of data
 **/
function dataCounter() {
    var eb_data_amount = 7975,
        eb_data_per_year = 4604,
        from_date = 1431041857294,
        now_date = $.now(),
        gb_convert_factor = 1000000000, // GB
        sec_diff = now_date - from_date,
        eb_data_per_second = eb_data_per_year / 365 / 24 / 60 / 60 / 1000
        eb_new_data_amount = eb_data_amount + sec_diff * eb_data_per_second,
        gb_new_data_amount = eb_new_data_amount * gb_convert_factor;
    $(".data_counter").text(Math.ceil(gb_new_data_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " GB");
}
/**
 *   interactive productivity/sales increasement chart
 **/
function createIconChart() {
    var ctx = $("#pi_chart").get(0).getContext("2d");
    var ctx2 = $("#si_chart").get(0).getContext("2d");
    var data_pi = [{
        value: 0,
        color: color_1,
    }, {
        value: 100,
        color: "#2E3C55",
    }];
    var data_si = [{
        value: 0,
        color: "#BA2D0B",
    }, {
        value: 10,
        color: "#452B34",
    }];
    options = {
        responsive:true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        percentageInnerCutout: 78, // This is 0 for Pie charts
        animationSteps: 60,
        animationEasing: "easeOutQuart",
        animateRotate: true,
        animateScale: false,
        showTooltips: false,
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
    }
    pi_chart = new Chart(ctx).Doughnut(data_pi, options);
    si_chart = new Chart(ctx2).Doughnut(data_si, options);
    $(".increase-button").click(function() {
        $(".icon-chart a").removeClass("active");
        $(this).addClass("active");
        pi = parseInt($(this).data("productivity-increase"));
        pi_chart.segments[0].value = pi;
        pi_chart.segments[1].value = 100 - pi;
        pi_chart.update();
        $(".pi-number span").html("+" + pi + " %")
        si = ($(this).data("sales-increase"));
        si_chart.segments[0].value = si;
        si_chart.segments[1].value = 10 - si;
        si_chart.update();
        $(".si-number span").html("+" + si + " $")
    })
    $(".icon-chart a.first").trigger("click");
}

function createGrowthChart() {
    var ctx = $("#growth-chart").get(0).getContext("2d"),
        options = {
            responsive:true,
            maintainAspectRatio: true,
            scaleFontFamily: "Proxima Nova, Helvetica, sans-serif",
            scaleFontSize: 14,
            // String - Scale label font weight style
            scaleFontStyle: "bold",

            // String - Scale label font colour
            scaleFontColor: "#fff",
            showTooltips: false,
            scaleOverride: true,
            scaleSteps: 10,

            scaleStepWidth: 10000/10,
            scaleStartValue: 0,
            scaleShowVerticalGridLines : false,
            scaleLineColor: "#2E3C55",
            pointDot : true,
            datasetStroke : true,
            datasetFill : false,
            pointDotRadius :10,
            pointDotStrokeWidth : 5,
            datasetStrokeWidth : 5,

        };
    var growth_data = [{
        label: "Sensoren & Geräte",
        fillColor: color_2,
        strokeColor: color_2,
        pointColor: "#292f45",
        pointStrokeColor: color_2,
        data: [2000, 2950, 3000, 5500, 6900, 9500]
    }, {
        label: "Soziale Medien",
        fillColor: "green",
        strokeColor: "red(220,220,220,1)",
        data: [2000, 2585, 2940, 3065, 4960, 6625]
    }, {
        label: "VoiP",
        fillColor: "blue",
        strokeColor: "rgba(220,220,220,1)",
        data: [2000, 2000, 2340, 2465, 3860, 4125]
    }, {
        label: "Unternehmensdaten",
        fillColor: "yellow",
        strokeColor: "rgba(220,220,220,1)",
        data: [2000, 2055, 2420, 2495, 2880, 3370]
    }]
     data = {
            labels: ["2010", "2011", "2012", "2013", "2014", "2015"],
            datasets: [growth_data[0] ]  
    };
    var growth_chart = new Chart(ctx).Line(data, options);

     $('#growth-slider').on('change.fndtn.slider', function(){
        var dataset = $('#growth-slider').attr('data-slider');
        for(var i = 0; i<growth_chart.datasets[0].points.length; i++){

            growth_chart.datasets[0].points[i].value = growth_data[dataset].data[i];
            growth_chart.datasets[0].fillColor = growth_data[dataset].fillColor;
        }
       ///growth_chart.datasets[0].points[0] = 0;
        growth_chart.update();
    });

    $(".growth-button").click(function(){   
        $(".growth-button").removeClass("active");
        $(this).addClass("active");
        var dataset = parseInt($(this).data("dataset"))       
        for(var i = 0; i<growth_chart.datasets[0].points.length; i++){

            growth_chart.datasets[0].points[i].value = growth_data[dataset].data[i];
            growth_chart.datasets[0].fillColor = growth_data[dataset].fillColor;
        }
       ///growth_chart.datasets[0].points[0] = 0;
        growth_chart.update();

    })
}
/**
 *   interactive header mesh animation
 **/
function createCanvas() {
    // based on http://codepen.io/dleatherman/pen/kAzgw
    var header = $('.header-mesh');
    header.html("");
    var canvas = $('<canvas></canvas>').appendTo(header)[0],
        ctx = canvas.getContext('2d'),
        color = color_1,
        colors = []
        idle = null,
        mousePosition;
    canvas.width = 2000;
    canvas.height = 2000;
    canvas.style.display = 'block';
    ctx.fillStyle = "#5595C2";
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = color;
    var meshFactor = 1,
        dots = {
            nb: 400 * meshFactor,
            distance: 150 * meshFactor,
            d_radius: 350 * meshFactor,
            array: [],
        }
    var mousePosition = {
        x: canvas.width / 2,
        y: 10 * canvas.height / 100
    };

    function Dot() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = -.5 + Math.random();
        this.vy = -.5 + Math.random();
        this.radius = Math.random() * 7;
    }
    Dot.prototype = {
        create: function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        },
        animate: function() {
            for (var i = 0, dot = false; i < dots.nb; i++) {
                dot = dots.array[i];
                if (dot.y < 0 || dot.y > canvas.height) {
                    dot.vx = dot.vx;
                    dot.vy = -dot.vy;
                } else if (dot.x < 0 || dot.x > canvas.width) {
                    dot.vx = -dot.vx;
                    dot.vy = dot.vy;
                }
                dot.x += dot.vx;
                dot.y += dot.vy;
            }
        },
        line: function() {
            for (var i = 0; i < dots.nb; i++) {
                for (var j = 0; j < dots.nb; j++) {
                    i_dot = dots.array[i];
                    j_dot = dots.array[j];
                    if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
                        if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
                            ctx.lineWidth = 0.3;
                            ctx.beginPath();
                            ctx.moveTo(i_dot.x, i_dot.y);
                            ctx.lineTo(j_dot.x, j_dot.y);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
            }
        }
    };

    function createDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < dots.nb; i++) {
            dots.array.push(new Dot());
            dot = dots.array[i];
            dot.create();
        }
        dot.line();
        dot.animate();
    }
    idle = setInterval(createDots, 1000 / 30);
    $(canvas).on('mousemove mouseleave click', function(e) {
        if (e.type == 'mousemove' || e.type == 'click') {
            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;
        }
        if (e.type == 'mouseleave') {
            //mousePosition.x = canvas.width / 2;
            //mousePosition.y = canvas.height / 2;
        }
    });
    $(document).foundation();

};