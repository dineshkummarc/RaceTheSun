// LIFE
var LifeForm = new Class({
    Extends: Mover,
    vector: new Array(1, 1),
    energy: 0,
    radius: 1,
    isDead: false,
    goto: Array(),
    timer: new Object(),
    genetic: new Object(),
    randomic: new Object(),
    initialize: function(genetic, point, randomic){
        this.parent(point, 1);
        this.genetic.radius = genetic.radius;
        this.genetic.speed = genetic.speed;
        this.genetic.lifeTime = genetic.lifeTime;
        this.genetic.deadTime = genetic.deadTime;
        this.genetic.reproTime = genetic.reproTime;
        this.genetic.growTime = genetic.growTime;
        this.genetic.searchDistance = genetic.searchDistance;
        this.genetic.bit = typeof genetic.bit != 'undefined' ? genetic.bit : 1/(this.genetic.radius*this.genetic.radius);
        this.genetic.inertion = typeof genetic.inertion != 'undefined' ? genetic.inertion : 1;

        this.randomic.kanibal = typeof randomic != 'undefined' && typeof randomic.kanibal != 'undefined' ? randomic.kanibal : 0;

        this.timer.deathTimer = 0;
        this.timer.repoTimer = 0;
        this.timer.lifeTimer = 0;
        this.timer.growTimer = this.genetic.growTime;

        this.timer.lifeTimer = this.genetic.lifeTime;
        this.index = racers.length;

        this.energyMax = 2*genetic.radius;
        this.point = point;

        this.square = this.radius*this.radius*4;
        this.addEvent('libcanvasSet', function (){
            this.resize();
        });

        this.timer.deathTimer = -50;
    },
    grow: function() {
        this.radius++;
        this.square = this.radius*this.radius*4;
        this.resize();
    },
    decay: function(size) {
        this.square = this.square - size;
        this.radius = Math.sqrt(this.square/4).round(2);
        this.resize();
    },
    resize: function() {
        var rgb = new Array();
        rgb.push(this.genetic.deadTime.toInt() + 200*this.randomic.kanibal.toInt());
        rgb.push(this.randomic.kanibal==2 ? 0 : this.square.toInt());
        rgb.push(this.genetic.speed.toInt());
        for(var i=0;i<=2;i++) {
            if(rgb[i]>255) {
                rgb[i]=255;
            }
        }
        if(!this.isDead) {
            this.color = 'rgb('+rgb[0]+', '+rgb[1]+', '+rgb[2]+')';
            this.color = this.color.rgbToHex();
        }
        this.shape.radius = this.radius;
        this.shape.shadow = '0 0 '+this.energy+' ' + this.color;
    },
    death: function() {
        if(!this.isDead) {
            this.color = '#7c0003';
            this.isDead = true;
            this.stopMoving();
        }
        this.decay(this.genetic.bit*10);
        if(this.square<=0) {
            this.libcanvas.rmElement(this);
            delete racers[this.index];
            delete this;
        }
    },
    reproduction: function() {
        var point = new LibCanvas.Point(this.shape.center.x+this.shape.radius+1,this.shape.center.y+this.shape.radius+1);
        var genetic = new Object();
        Object.each(this.genetic, function(value, key) {
            genetic[key] = rand(value*0.85,value*1.15).round(2);
        });
        var randomic = new Object();
        Object.each(this.randomic, function(value, key) {
            var test = value ? rand(2) : rand(1);
            randomic[key] = test.floor();
        });
        if(randomic.kanibal<2) {
            var child = new LifeForm(genetic, point, randomic).setZIndex(20);
        } else {
            var child = new Eater(genetic, point, randomic).setZIndex(30);
        }
        this.libcanvas.addElement(child);
        racers.push(child);
        this.timer.repoTimer = -1 * this.genetic.reproTime;
    },
    checkPlace: function() {
        var lifeForm = this;
        racers.each(function(item, index) {
            if(index==lifeForm.index) {
                return;
            }
            if(typeof item.shape == 'undefined') {
                return;
            }
            if(lifeForm.shape.intersect(item.shape)) {
                var x = lifeForm.shape.center.x>item.shape.center.x ? lifeForm.genetic.inertion : -1 * lifeForm.genetic.inertion;
                var y = lifeForm.shape.center.y>item.shape.center.y ? lifeForm.genetic.inertion : -1 * lifeForm.genetic.inertion;
                lifeForm.point.move([x,y]);
                item.point.move([-1*x,-1*y]);
            }
        });
        this.draw();
    },
    getEnergy: function() {
        var eat = false;
        var diff = this.compare(theSun);
//                if((this.randomic.kanibal && grid[i][j][DEAD_INDEX]>0)) {
//                    var racer = racers[grid[i][j][DEAD_INDEX]];
//                    if(typeof racer != 'undefined') {
//                        eat = true;
//                        plusEnergy = plusEnergy + racer.genetic.bit;
//                        racer.decay(racer.genetic.bit*this.radius);
//                    }
//                }
        if(this.randomic.kanibal==2 && eat && minusEnergy<0) {
            minusEnergy = 0;
        }
        var diffEnergy = (diff[0] * theSun.power - diff[1]) * this.genetic.bit;
        return diffEnergy.round(2);
    },
    move: function(time) {
        if(typeof this.shape == 'undefined') {
            return;
        }
        this.energy = this.energy + this.getEnergy();
        if(this.timer.growTimer>0) {
            if(this.energy>0) {
                this.timer.growTimer--;
            }
            this.energy = 0;
            this.timer.deathTimer = 0;
            return;
        }
        if(this.timer.lifeTimer<=0 || this.timer.deathTimer>=this.genetic.deadTime) {
            this.death();
            return;
        }
        this.timer.lifeTimer--;
//        this.plato.setBusy(theSun.shape.center, theSun.shape.radius, 0);
        this.libcanvas.ctx.clearRect(this.shape.center.x-this.shape.radius*2, this.shape.center.y-this.shape.radius*2, this.shape.radius*5, this.shape.radius*5);
        this.moveTo(theSun.shape.center, this.genetic.speed);
        this.checkPlace();
//        this.plato.setBusy(theSun.shape.center, theSun.shape.radius, this.index);
        if(this.energy>0 && this.radius<this.genetic.radius) {
            this.grow();
        }

        if(this.energy>=this.energyMax) {
            this.energy = this.energyMax;
            this.timer.repoTimer++;
        } else {
            this.timer.repoTimer = 0;
        }
        if(this.energy<=0) {
            this.energy = 0;
            this.timer.deathTimer++;
        } else {
            this.timer.deathTimer = 0;
        }

        if(this.timer.repoTimer >= this.genetic.reproTime) {
            this.reproduction();
        }
        this.shape.shadow = '0 0 '+this.energy+' ' + this.color;
    },
    findEat: function(eatIndex) {
        var vector = new Array(0,0);
        if(
            this.goto[0]>=this.xy[0]-this.radius && this.goto[0]<=this.xy[0]+this.radius
            &&
            this.goto[1]>=this.xy[1]-this.radius && this.goto[1]<=this.xy[1]+this.radius
        ) {
            this.goto = new Array(0,0);
        }
        if(this.goto[0]>0 && this.goto[1]>0) {
            vector = this.compareXY(this.xy, this.goto);
        } else {
            for(var iteration=1;iteration<=3;iteration++) {
                vector = this.circleSearchEat(iteration);
                if(vector[0]!=0 || vector[1]!=0) {
                    return vector;
                }
            }
        }
        return vector;
    },
    circleSearchEat: function(eatIndex, iteration) {
        var vector = new Array(0, 0);
        for(var i=this.xy[0]-this.radius*iteration,imax=this.xy[0]+this.radius*iteration;i<=imax;i++) {
            for(var j=this.xy[1]-this.radius*iteration,jmax=this.xy[1]+this.radius*iteration;j<=jmax;j++) {
                if(gridDefined(i,j) && grid[i][j][eatIndex]>0) {
                    this.goto = new Array(i,j);
                    return this.compareXY(this.xy, this.goto);
                }
            }
        }
        return vector;
    }
});

var Eater = new Class({
    Extends: LifeForm,
    initialize: function(genetic, xy, randomic){
        this.parent(genetic, xy, randomic);
    },
    moveXY: function() {
        this.vector = this.findEat(DEAD_INDEX);
        for(var i=0;i<=1;i++) {
            var shift = rand(this.genetic.speed);
            this.xy[i] = this.xy[i] + shift*this.vector[i];
            if(this.xy[i]-this.radius<0 || this.xy[i]+this.radius>platoXy[i]) {
                this.vector[i] = this.xy[i]-this.radius<0 ? 1 : -1;
                this.xy[i] = this.xy[i] + shift*this.vector[i];
            }
            var speedMod = this.checkPlace();
            this.xy[i] = (this.xy[i] - speedMod*shift*this.vector[i]).round();
        }
    }
});