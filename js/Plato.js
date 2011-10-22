var Plato = new Class({
    Extends: LibCanvas.Behaviors.Drawable,

    width : 500,
    height: 500,

    busy: [],

    initialize: function(point, radius){
        for(var x=0;x<=this.width;x++) {
            this.busy[x] = [];
            for(var y=0;y<=this.height;y++) {
                this.busy[x][y] = 0;
            }
        }

    },

    draw: function () {
        this.libcanvas.ctx.drawImage(
            this.libcanvas.getImage('bg').sprite(0,0,this.width,this.height)
        );
    },

    setBusy: function(point, radius, index) {
        var xMin = point.x-radius;
        var xMax = point.x+radius;
        var yMin = point.y-radius;
        var yMax = point.y+radius;
        xMin = xMin<0 ? 0 : xMin;
        yMin = yMin<0 ? 0 : yMin;
        xMax = xMax>this.width ? this.width : xMax;
        yMax = yMax>this.height ? this.height : yMax;
        for(x=xMin;x<=xMax;x++) {
            for(y=yMin;y<=yMax;y++) {
                this.busy[x][y] = index;
            }
        }
    }
});