var Mover = new Class({
    Implements : [ LibCanvas.Behaviors.Drawable, LibCanvas.Behaviors.Moveable , LibCanvas.Behaviors.Animatable],
    radius: 0,
    xy: [0, 0],
    squareXY: [[0,0], [0,0]],
    color: '#ff5',
    point: null,
    initialize: function(point, radius){
        this.point = point;
        this.radius = radius;
        this.addEvent('libcanvasSet', function (){
            this.shape = new LibCanvas.Shapes.Circle(this.point, this.radius);
            this.draw();
//            this.image = this.libcanvas.getImage('sun').sprite( 0, 0, 26, 26 );
        });
    },
    controls: function (up, down) {
        this.addEvent('libcanvasSet', function () {
            var lc = this.libcanvas.addFunc(function (time) {
                if (lc.getKey(up)) {
                    this.move( -time );
                } else if (lc.getKey(down)) {
                    this.move(  time );
                }
            }.bind(this));
        });
        return this;
    },

    update: function (time) {
        this.move(time);
    },
    draw: function () {
        this.libcanvas.ctx.fill(this.shape, this.color);
    },


    setSquareXY: function() {
        this.squareXY = [[this.xy[0]-this.radius, this.xy[1]-this.radius], [this.xy[0]+this.radius, this.xy[1]+this.radius]];
    },
    setGrid: function(index, state) {
        this.setSquareXY();
        for(var i=this.squareXY[0][0]; i<=this.squareXY[1][0]; i++) {
            for(var j=this.squareXY[0][1]; j<=this.squareXY[1][1]; j++) {
                if(gridDefined(i,j)) {
                    grid[i][j][index] = state;
                }
            }
        }
    },
    compare: function(circle) {
        if(!this.shape.intersect(circle.shape)) {
            return [0,1];
        } else {
            return [1,0];
        }
        if(
            this.shape.center.x+this.shape.radius<circle.shape.x+circle.shape.radius && this.shape.center.x-this.shape.radius>circle.shape.x-circle.shape.radius
            &&
            this.shape.center.y+this.shape.radius<circle.shape.y+circle.shape.radius && this.shape.center.y-this.shape.radius>circle.shape.y-circle.shape.radius
        ) {
            return [1,0];
        }
        var minX = this.shape.center.x-this.shape.radius;
        var maxX = this.shape.center.x+this.shape.radius;
        var minY = this.shape.center.y-this.shape.radius;
        var maxY = this.shape.center.y+this.shape.radius;
        var out = [0,0];
        for(var x=minX; x<=maxX; x++) {
            for(var y=minY; y<=maxY; y++) {
                if(!this.shape.hasPoint([x, y])) {
                    continue;
                }
                if(circle.shape.hasPoint([x, y])) {
                    out[0]++;
                } else {
                    out[1]++;
                }
            }
        }
        return out;
    }
});