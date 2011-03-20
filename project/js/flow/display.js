function FlowSolverDisplay(canvasId){
	var width =64; 
	var height =64;
	var canvas = document.getElementById(canvasId),
		ctx = canvas.getContext("2d"),
		imageData = ctx.createImageData(width,height),
		worker = new Worker("js/flow/solverWorker.js"),
		globalAlpha = 405,
		solverInt; 
		
	canvas.width = width;
	canvas.height = height;

	worker.onmessage = function(e){
		switch(e.data.cmd){
			case "ready":
				solverInt = setInterval(function(){
					worker.postMessage({cmd:"tick"});
				},50);
				break;
			case "ticked":
				var rho = e.data.density; 
				for (i = 0, il = (width)*(height)*4 ; i < il; i += 4){
					var index = i/4;
					imageData.data[i] = 255;
					imageData.data[i+1] = 255;
					imageData.data[i+2] = 255;
					imageData.data[i+3] = rho[index]*globalAlpha;
				}
				ctx.putImageData(imageData,0,0);
			break;
		}
	};
	return{
		start:function(){
			worker.postMessage({cmd:"init",width:width,height:height});
		},
		setAirfoil:function(airfoil){
			worker.postMessage({cmd:"airfoil",airfoil:airfoil}); 
		},
		setAlpha:function(alpha){
			worker.postMessage({cmd:"alpha",alpha:alpha}); 
		},
		fadeOut:function(delay){
			step = globalAlpha / (delay / 30); 
			setInterval(function(){
				globalAlpha -= step; 
				if (globalAlpha <= 0){ clearInterval(this); clearInterval(solverInt);}
			},30);
		}
	}
}
 