var racers = new Array();
var libcanvas;
var stat = document.id('stat');
var platoXy = [500, 500];
var statId = 0;

var theSun, plato, racers = [];
window.addEvent('domready', function() {
    new RaceController(document.id('plato'));
});

var start = false;
function pause() {
    if(start) {
        clearInterval(timerInterval);
    } else {
        timerInterval = setInterval(function() {

        }, 100);
    }
    start = !start;
}

function showStat() {
    var lifeForm = racers[statId];
    if(typeof lifeForm == 'undefined' || typeof lifeForm.genetic == 'undefined') {
        return;
    }
    var html = '<ul>';
    html += '<li>Форма жизни №' + statId;// + ': ' + lifeForm.point.x + 'x'+ lifeForm.point.y +  ' SUN:' + grid[lifeForm.point.x][lifeForm.point.y][SUN_INDEX] + '</li>';
    Object.each(lifeForm.genetic, function(value, key) {
        html += '<li>' + key + ': ' + value + '</li>';
    });
    Object.each(lifeForm.timer, function(value, key) {
        html += '<li><i>' + key + '</i>: ' + value + '</li>';
    });
    Object.each(lifeForm.randomic, function(value, key) {
        html += '<li><b>' + key + '</b>: ' + value + '</li>';
    });
    html += '<li>Энергия : ' + lifeForm.energy + '</li>';
    html += '<li><b>lifeForm.bgColor</b>: genetic.deadTime, square, genetic.speed + energySpeed</li>';
    html += '<li><b>' + lifeForm.bgColor + '</b>: ' + lifeForm.genetic.deadTime+', '+lifeForm.square+', '+lifeForm.genetic.speed +'+'+lifeForm.energySpeed + '</li>';
    html += '</ul>';
    stat.setProperty('html', html);
}

function rand( min, max ) {
    if( max ) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        return Math.floor(Math.random() * (min + 1));
    }
}

