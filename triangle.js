document.addEventListener('DOMContentLoaded', function() {
	var canvas = document.getElementById('canvas');

	var ctx = canvas.getContext('2d');

	var a = 10;
	var b = 10;

	var colors = ['red', 'green', 'blue'];

	function Turtle(x, y, color)
	{
		this.x = x;
		this.y = y;
		this.color = color;
		this.angle = 0.0;
	}

	Turtle.prototype.line = function(length, color)
	{
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);

		this.x += Math.cos(Math.PI * 2 * -this.angle) * length;
		this.y += Math.sin(Math.PI * 2 * -this.angle) * length;
		
		ctx.lineTo(this.x, this.y);

		ctx.strokeStyle = color || this.color;
		ctx.stroke();

		ctx.closePath();

		return this;
	}

	Turtle.prototype.move = function(length)
	{
		this.x += Math.cos(Math.PI * 2 * -this.angle) * length;
		this.y += Math.sin(Math.PI * 2 * -this.angle) * length;
		
		ctx.moveTo(this.x, this.y);

		return this;
	}

	Turtle.prototype.rotate = function(angle)
	{
		this.angle = (this.angle + angle) % 1.0;

		return this;
	}

	function axis(x, y, r, d, w, n)
	{
		for (var i = 0; i < n; ++i)
		{
			var turtle = new Turtle(x, y, '#ccc');

			turtle.rotate(r + -1/4 + i / n);
			turtle.move(d);

			// length of a side of the inner triangle
			var a = 2 * Math.cos(.5/n * Math.PI) * d;

			// length of the overshoot
			var b = w / Math.cos(.5/n * Math.PI);

			// second line
			var c = Math.tan(.5/n * Math.PI) * w + a + b + Math.tan(1/n * Math.PI) * w;

			// third line
			var e = Math.tan(1/n * Math.PI) * w + c - Math.tan(.5/n * Math.PI) * w;

			// forth line
			// var g = Math.tan(1/n * Math.PI) * w + e + Math.tan(.5/n * Math.PI) * w;

			// last line, the tail
			var f = b;
			// var f = Math.sqrt(2 * w * w);



			turtle
				.rotate(1/4)
				.rotate(.5/n)
				.line(a + b)
				.rotate(1/n)
				.line(c)
					// .line(Math.tan(.5/n * Math.PI) * w, 'red')
					// .line(a, 'green')
					// .line(b, 'blue')
					// .line(Math.tan(1/n * Math.PI) * w, 'yellow')
				.rotate(1/n)
				.line(e)
					// .line(Math.tan(1/n * Math.PI) * w, 'red')
					// .line(c, 'green')
					// .line(-Math.tan(.5/n * Math.PI) * w, 'yellow')
				// .rotate(1/n)
				// .line(g)
				.rotate(.5/n)
				.line(f);
		}
	}

	function resize()
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		display();
	}

	function control(id, value)
	{
		var el = document.getElementById(id);

		if (value !== undefined)
		{
			if (el.max)
				value %= el.max;

			el.value = value;

			var e = document.createEvent("HTMLEvents");
			e.initEvent('change', true, true);
			el.dispatchEvent(e);
		}

		return parseFloat(el.value);
	}

	function smooth(start, end, duration, t)
	{
		var state = Math.cos(Math.PI * ((t % duration) / duration - .5));
		return start + (end - start) * state;
	}


	function animate(t)
	{
		var r = smooth(0, 1, 120000, t),
			n = 3,
			d = smooth(0, 150, 10000, t),
			w = smooth(10, 150, 15000, t);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		axis(canvas.width / 2, canvas.height / 2, r, d, w, n);
		
		webkitRequestAnimationFrame(animate);
	}

	webkitRequestAnimationFrame(animate);


	function display()
	{
		var w = control('w');
		var d = control('d');
		var r = control('r');
		var n = control('n');

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		axis(canvas.width / 2, canvas.height / 2, r, d, w, n);
	}

	function scene(x, y)
	{
		document.getElementById('controls').style.display = 'none';
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < 10; ++i)
			for (var j = 0; j < 10; ++j)
				axis(x + i * 159 + j * 318, y + i * 275, 0, 50, 50, 3);
	}

	Array.prototype.forEach.call(
		document.querySelectorAll('#controls input'),
		function(el) {
			el.addEventListener('change', display);
		});

	window.onresize = resize;

	resize();

	// scene(-300, -300);

	/*
	var drag_origin = null;

	canvas.addEventListener('mousedown', function(e) {
		drag_origin = [e.pageX, e.pageY];
	});

	canvas.addEventListener('mousemove', function(e) {
		if (drag_origin)
			control('r', (e.pageX - drag_origin[0]) / 512);
	});

	canvas.addEventListener('mouseup', function(e) {
		drag_origin = null;
	});
	*/
});