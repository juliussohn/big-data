var color_1 = "#4D7EA8"
var color_2 = "#D1340D"

$(document).ready(function() {
    resizeWindow()
    createCanvas()
    $(window).resize(function() {
        resizeWindow();
    })
    createIconChart();
    //createGrowthChart();
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
            mousePosition.x = e.pageX+400;
            mousePosition.y = e.pageY;
        }
        if (e.type == 'mouseleave') {
            //mousePosition.x = canvas.width / 2;
            //mousePosition.y = canvas.height / 2;
        }
    });

    $(".easteregg").click(function(){
        $('#myModal').foundation('reveal', 'open', 'modal.html');
    })
    var audioElement=false
    $(".party").click(function(){   
            bounce =function(enable){
                if(enable == true){
                    $("body").addClass("bounce");
                }else{
                    $("body").removeClass("bounce");
                }

            }
            var btn = $(this)
            if(!audioElement){
                
                audioElement = document.createElement('audio');
                audioElement.setAttribute('src', 'mp3/miami.mp3');
                audioElement.setAttribute('autoplay', 'autoplay');
                $(this).html('Lade Musik ...');
                $(this).addClass('disabled');
                 btn.addClass('active');
                 btn.removeClass('scale');
                 $(".player_wrapper").slideDown();
                $.get();

                audioElement.addEventListener("loadeddata", function() {
                  btn.html('Pause');
                bounce(true);
                  btn.removeClass('disabled');
                  

                }, true);

                var timer = setInterval(update_progress, 20);
                
                audioElement.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);

            }else{
                
                if(!audioElement.paused){
                    audioElement.pause();
                    bounce(false);
                    $(this).html('Play');
                }else{
                    audioElement.play();
                    bounce(true);
                    $(this).html('Pause');
                }
                
            }
            function update_progress() {
                  var track_length = audioElement.duration,
                    track_current = audioElement.currentTime,
                    percent = percent = (track_current/track_length)*100;
                    $(".player_progress_bar").width(percent+"%");
                }
            
    })
    $(".player_wrapper").click(function(e){
        var mouse_x = e.pageX,
            width = $(document).width(),
            perc = (mouse_x/width)
            length = audioElement.duration,
            play_target = length*perc;
            audioElement.currentTime = play_target
    })
    
    $(document).foundation();
    

};