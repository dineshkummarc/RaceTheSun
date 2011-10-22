var Sun = new Class({
    Extends: Mover,
    radius: 1,
    speed: 1,
    color: '#fafbc3',
    power: 1,
    initialize: function(sunRadius, sunSpeed){
        this.parent(this.point, sunRadius);
        this.radius = sunRadius;
        this.point = new LibCanvas.Point(plato.width/2, this.radius*2);
        this.speed = sunSpeed;
        this.ogiginalSpeed = sunSpeed;
        this.vector = new LibCanvas.Point(1,1);
        this.path = new LibCanvas.Shapes.Circle(plato.width/2, plato.height/2, (plato.height/2)-this.radius*2+1);
    },
    season: function(coef) {
//        new LibCanvas.Behaviors.Animatable(this.shape)
//            .animate({fn: 'linear', time: 3000, props: {'radius': coef*this.radius}});
        this.shape.radius = coef*this.radius;
        this.speed = this.ogiginalSpeed/coef;
    },
    move: function(time) {
        if(typeof this.shape == 'undefined') {
            return;
        }
        var center = this.point;
        this.libcanvas.ctx.clearRect(center.x-this.shape.radius-1, center.y-this.shape.radius-1, this.shape.radius*2+2, this.shape.radius*2+2);
        if(center.x>=plato.width/2 && center.y<=plato.height/2) {
            this.vector.x = (this.path.hasPoint(center) ? 1 : 0) * this.speed;
            this.vector.y = (this.path.hasPoint(center) ? 0 : 1) * this.speed;
            this.season(0.9);
        } else if(center.x>=plato.width/2 && center.y>=plato.height/2) {
            this.vector.x = (this.path.hasPoint(center) ? 0 : -1) * this.speed;
            this.vector.y = (this.path.hasPoint(center) ? 1 : 0) * this.speed;
            this.season(1.5);
        } else if(center.x<=plato.width/2 && center.y>=plato.height/2) {
            this.vector.x = (this.path.hasPoint(center) ? -1 : 0) * this.speed;
            this.vector.y = (this.path.hasPoint(center) ? 0 : -1) * this.speed;
            this.season(1.2);
        } else if(center.x<=plato.width/2 && center.y<=plato.height/2) {
            this.vector.x = (this.path.hasPoint(center) ? 0 : 1) * this.speed;
            this.vector.y = (this.path.hasPoint(center) ? -1 : 0) * this.speed;
            this.season(0.5);
        }
        this.point.move(this.vector);
        this.draw();
    }
});
