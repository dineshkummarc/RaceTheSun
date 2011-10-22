var RaceController = new Class({
    initialize: function (canvas) {
        this.libcanvas = new LibCanvas(canvas, {
                fps: 60,
                clear: 'rgba(20, 20, 20, 0)',
                preloadImages: {
                    bg : 'i/plato_bg_' + rand(5) + '.jpg'
                }
            })
            //.listenKeyboard([ 'w', 's', 'a', 'd', 'aup', 'adown', 'left', 'right' ])
            .addEvent('ready', this.start.bind(this))
            .start()
            .fpsMeter();
    },

    start: function () {
        var libcanvas = this.libcanvas;
        plato = new Plato();
        racers = [];

        libcanvas.addElement(plato);
        libcanvas.update();


        var sunLayer = libcanvas.createLayer('sun',Infinity);
        theSun = new Sun(rand(40,60), rand(0.5,1.5)).setZIndex(10);
        sunLayer.addElement(theSun);
        var lifeLayer = libcanvas.createLayer('life',Infinity);

        sunLayer
            .addFunc(function (time) {
                theSun.move(time);
            });
        lifeLayer
            .addFunc(function (time) {
                racers.each(function(item) {
                    item.move(time);
                });
                showStat();
                lifeLayer.update();
            });

        for(var i=0;i<=rand(4,10);i++) {
            var genetic = new Object();
            genetic.speed = 100;
            genetic.radius = 5;
            genetic.deadTime = 30;
            genetic.reproTime = 15;
            genetic.searchDistance = 10;
            genetic.lifeTime = rand(300,600);
            genetic.growTime = rand(5,10);
            var point = new LibCanvas.Point(Number.random(10, plato.width), Number.random(10, plato.height));
            var lifeForm = new LifeForm(genetic, point).setZIndex(20);
//            var lifeForm = new Sun(rand(40,60), rand(0.5,1.5)).setZIndex(10)
            lifeLayer.addElement( lifeForm );
            racers.push(lifeForm);
        }
    }
});