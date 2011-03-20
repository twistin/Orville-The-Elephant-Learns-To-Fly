function Scenes(frontId,backId,solver){
	var gameW = 980, 
		gameH = 600,
		gw = gameW*0.5, 
		gh = gameH*0.5,
		airfoil, aircraftSet, orvilleSet,
		greenAirfoil = {stroke:"#4a4",fill:"#006838","stroke-width":3},
		redAirfoil = {stroke:"#a44",fill:"#680038","stroke-width":3},
		dialogStyle = {	"fill":"#fff","font-size":20,
						"font-family":"CrimeFighter BB"},
		messageBox, 
		draggable = true; 
	
	var front = Raphael(frontId,gameW,gameH),
		back = Raphael(backId,gameW,gameH),
		sky = back.rect(0,0,gameW,gameH).attr({fill:"90-#13354a-#132149"}).toBack();
		
	
	/**
		Opens with the title
	*/
	(function OpeningScene(){
		var titleText = ["Orville","the","Elephant","\nLearns","How","to","Fly"], 
			textSet = back.set();
			
		cloudObj = DrawClouds();
		drawIntro();
		
		function drawIntro(){ 
			textSet.push(back.image("images/logo.png",220,-100,520,75)
				.animate({"y":gh-120},1000,"bounce",function(){
					setTimeout(drawTitle,1000);
			}));
		}
		
		function drawTitle(){
			var title = back.text(gameW/2,gh+50,"")
				.attr({	"fill":"#fff","font-size":52,
						"font-weight":"bold","stroke-width":2,stroke:"#000",
						"font-family":"Arfmoochikncheez"});
			textSet.push(title);
			drawNextWord();
			var titleSoFar = "", i = 0;
			function drawNextWord(){
				setTimeout(function(){
					titleSoFar +=" "+titleText[i];
					title.attr({"text":titleSoFar});
					if (++i >= titleText.length){
						setTimeout(blowAwayIntro,1400);
					}
					else drawNextWord();
				},200)
			}
		}
		
		function blowAwayIntro(){
			Scene1();
			textSet.animate({"x":-980},1000,">",function(){
				textSet.remove();
			});
		}
		
	})();
	
	
	/** Intro, orville reaches for controls and fails*/
	function Scene1(){
		var aircraft = DrawAircraft();
		back.image("images/controlTower.png",10,450,150,150);
		var dialog = back.text(gw,480,"Orville... is that you?").attr(dialogStyle);	
		aircraft.flyIn(function(){
		aircraft.lookAtUser(function(){
		aircraft.fadeOutFront(function(){
			dialog.attr("text","What are you doing! you are an elephant, \n"
						+"you can't fly! \nYou can't even reach the controls!");
			setTimeout(function(){aircraft.tryReaching(function(){
				dialog.attr("text","Dont' worry, We'll get you down, \n"
						+"First, I'll have to explain a few things.\n Listen carefully.");
				setTimeout(function(){					
					aircraftSet.animate({opacity:0},1000,function(){
						cloudObj.kill();
						dialog.attr("text", "Air over the wings creates an upward force");
					DrawAirfoilAndSolver();
				});},2000);
			});},2000);
		}); }); });
	}
		
	/** 
		Fade in the aircraft then zoom out. 	
		Put in some clouds in motion. Allow the user to rotate the plane in place
		show lift arrows
	*/
	function DrawAircraft(){
		aircraftSet = back.set();
		orvilleSet = back.set();
		var aircraftBack = back.image("images/plane1.png",940,110,780,250);
		var orville = back.image("images/orvilleSeated.png",1220,173,137,142);
		var orvillesEye = back.circle(1287,201,3).attr({fill:"#000"});
		var orvillesArm =  back.image("images/orvillesArm.png",1286,245,30,28);
		var aircraftFront = back.image("images/plane1solid.png",940,110,780,250);
		orvilleSet.push(orville,orvillesEye,orvillesArm);
		aircraftSet.push(aircraftFront,aircraftBack,orvilleSet);
		 
		return {
			flyIn:function(callback){
				aircraftSet.animate({"opacity":1,"translation":"-840 " + 0},4000,"elastic",function(){
					callback(); 
				});
			},
			fadeOutFront:function(callback){
				aircraftFront.animate({"opacity":0},1000,function(){ callback(); });
			},
			lookAtUser:function(callback){
				orvillesEye.animate({"translation":"3.5 " + 0},600,"<>",function(){ callback()});		
			},
			tryReaching:function(callback){
				orvillesArm.animate({"rotation":"70","x":435,"y":242},600,">",function(){
				orvillesArm.animate({"translation":"-2 0"},400,"bounce",function(){
				orvillesArm.animate({"translation":"2 0"},1000,">",function(){
				orvillesArm.animate({"rotation":"0","x":445,"y":242},600,">",function(){
				orvillesEye.animate({"translation":"2,3"},600,"<>",function(){
					callback();
				}); }); }); }); });
			}
		}
	}
	
	/** 
		Starts the solver, lets the user drag the airfoil. 
	*/
	function DrawAirfoilAndSolver(){
		solver.start();
		solver.setAirfoil({t:.2,c:22,xOffset:32,yOffset:32});
		airfoil = front.set();
		path9=front.path("M200.99,3.89c3.17,0.54,6.38,1.1,9.62,1.66"
		 +"C137.29,13.45,19.06,18.49,2.06,5.57   c-2.34-1.78-2.76-3.9-0.87-6.4"
		 +"C20.88-20.52,85.28-15.9,200.99,3.89z");
		path9.attr(greenAirfoil);
		airfoil.push(path9);
		airfoil.translate(400,gh).scale(1.5)
		airfoil.drag(move,start,stop);

		function start(){
			startLesson1(); 
			this.startX = this._drag.x - this.paper.canvas.offsetParent.offsetLeft; 
			this.startY = this._drag.y - this.paper.canvas.offsetParent.offsetTop; 
			(this.startX < 490) ? this.reverse = true : this.reverse = false; 
		};
		
		function move(dx,dy){
			if (!draggable) return; 
			var x = this.startX +dx,
				y = this.startY +dy,
				angle = Raphael.angle(x,y,485,gh);
			if (this.reverse) angle += 180; 
			solver.setAlpha(angle);
			airfoil.rotate(angle,485,gh);
			OnAirfoilMoved(angle);
		}
		
		function stop(){}
		
		function startLesson1(){ 
			setTimeout(function(){Lesson1(back,front)},1000);
			startLesson1 = function(){}; //don't do this after the first time
		}
		Stalls();
	}
	
	/** External function called when airfoil moves*/
	function OnAirfoilMoved(angle){}
	
	/** Initial card panes */
	function Lesson1(back,front){
		 
		//setTimeout(textPane1,1000);
		
		function textPane1(){
			messageBox = PopUp(front,
				"Air is all around us. More text about pressure and shear forces, on some level.",
				textPane2);
		}
		
		function textPane2(){ 
			messageBox.hide(function(){		
				messageBox = PopUp(front,
					"More text about the air and educational stuff. Talk about Lift, drag and stalls",
					textPane3);
			}); 
		}
		
		function textPane3(){ 
			var liftArrow = new LiftArrow(front),
				dragArrow = new DragArrow(front); 
			OnAirfoilMoved = function(angle){
				liftArrow.setValue(angle);
				dragArrow.setValue(angle);
			}
			messageBox.hide(function(){
				setTimeout(function(){
					messageBox = PopUp(front,
					"When you're ready, click ok to learn about stalls",
					Stalls);
				},2000);
			});
		}
	}
	
	/** Pop up a message from the bottom of the screen */
	function PopUp(paper,msg,callback){
		var message = paper.set(),
			box = paper.rect(0,gameH,gameW,100,10),
			text = paper.text(gameW/2,gameH+20,msg).attr({"font-size":20});
		message.push(box).push(text); 
		box.animate({y:gameH-100},600,">");
		text.animate({y:gameH-80},600,">",function(){
			message.push(paper.rect(gameW/2-50,gameH-30,100,20,5).click(callback).attr({"cursor":"pointer","fill":"#fa3"}));
			message.push(paper.text(gameW/2,gameH-20,"Ok").attr({"font-size":20,"cursor":"pointer"}).click(callback));
		});
		box.attr({fill:"#fff",opacity:0.5}); 
		var hide = function(callback){
			message.animate({y:gameH+50},600,"<",function(){
				message.remove();
				callback();
			});
		}
		return{hide:hide}
	}
	
	/** Draw a lift arrow */
	function LiftArrow(paper){
		var magnitude=0, gw = gameW*0.5, gh = gameH*0.5;
		var arrow =  paper.path("M"+ gw + " " +gh+ "L" + gw + " " +  gh)
		.attr({"stroke-width":4,"stroke":"#7f7"});
		return{ setValue:function(value){
				magnitude = value; 
				arrow.attr("path","M"+ gw + " " +gh+ "L" + gw + " " +  (gh-magnitude));
		}}
	}
	
	/** Draw a drag arrow */
	function DragArrow(paper){
		var magnitude=0;
		var arrow =  paper.path("M"+ gw + " " +gh+ "L" + gw + " " +  gh)
		.attr({"stroke-width":4,"stroke":"#f77"});
		return{ setValue:function(value){
				magnitude = value; 
				arrow.attr("path","M"+ gw + " " +gh+ "L" + (gw+magnitude) + " " +  gh);
		}}
	}
	
	/** 
		Change the airfoil color and freeze the angle. 
		draw stream lines
	*/
	var topLine, bottomLine, streamLines, streamInt;
	 var Stalls = function(){
		messageBox.hide(function(){
			messageBox = PopUp(front,
				"You can see attached flow here",
				DrawSeparated);		
		});
		
		var neg = -1;
		//start with attached
		draggable = false;
		airfoil.attr(redAirfoil).animate({"rotation":"0,485,"+gh},500,DrawAttached); 
		solver.setAlpha(0);
		function DrawAttached(){
			topLine = back.path("M692.39,127.945l-269.25-25.969c-23.125-8-125.5-24-176.25-24c-63.375,0-68.25,18.748-75,18.748h-269");
			bottomLine = back.path("M-97.109,100.976h269c6.625,0,10.125,14.375,69.375,14.375c7.875,0,84.625,0.75,180.375-10.125l270.75,25.219");
			topLine.translate(215,206).scale(1.4).attr({stroke:"#66d"});
			bottomLine.translate(215,212).scale(1.4).attr({stroke:"#d66"});		
			streamLines = back.set(),offset= 970, 
			topLine.node.style.strokeDasharray = "7,7",
			bottomLine.node.style.strokeDasharray = "7,7";			
			streamLines.push(topLine).push(bottomLine);
			streamInt = setInterval(function(){
				offset -= 1;
				topLine.node.style.strokeDashoffset = (neg)*offset;
				bottomLine.node.style.strokeDashoffset = offset;
			},10);
			streamLines.attr({"stroke-width":6});
		}
		
		function DrawSeparated(){
			messageBox.hide(function(){
				messageBox = PopUp(front,
					"You can see separated flow here",
					function(){
						clearInterval(streamInt);
						topLine.remove(); bottomLine.remove();
						streamLines.remove();
						solver.setAlpha(0);
						DrawAircraft();
					});		
				topLine.hide(), bottomLine.hide();					
				solver.setAlpha(20);
				airfoil.animate({"rotation":"20,485,"+gh},500,function(){
					neg = 1; topLine.show(), bottomLine.show();
					topLine.attr("path","M-5,103l205,0.5c16.473,0,18.622-10.636,43-6.875c32.583,5.027,276.084,27.374,378.667-6.625");
					bottomLine.attr("path","M-5,115.5h201.189c19.311,0,143.463,65,213.811,65h211.667");
					topLine.translate(200,150).scale(2.5).attr({stroke:"#66d"});
					bottomLine.translate(220,183).scale(2.5).attr({stroke:"#d66"});					
				}); 
			});
		}
	}

	
	function DrawClouds(){
		clouds = []; 
		var cloudWidth = 300; 
		var cloud = back.path("M73,106.5c0,15.2-0.711,29.5,72.25,29.5c0,8.844,85.75,11,109.75-7.5"
					+"c30,12.5,81.5,2,81.5-13.5c0-19.898-23.034-36-51.5-36"
					+"c0-8.567-15.431-15.5-34.5-15.5c0-11.331-34.887-20.5-78-20.5"
					+"C142.376,43,118,55.076,118,70C93.127,70,73,86.325,73,106.5z")
			.attr({fill:"#fff","stroke-width":0,opacity:0.0});
				
		for (i = 0 ; i < 5; i++){
			clouds.push(cloud.clone().translate(Math.random()*gameW*2-gameW,Math.random()*gameH*2-gameH)
				.animate({opacity:0.75},2000));
		}
		
		var cloudInt = setInterval(function(){
			for (i = 0 ; i <5; i++){
				clouds[i].attr({"translation":15});
				if (clouds[i].attr("translation").x > gameW+cloudWidth)
					clouds[i].attr({"translation":-(gameW+2*cloudWidth)});
			}
		},30);	
		return {
			kill:function(){
				clearInterval(cloudInt);
				for (i = 0 ; i <5; i++) clouds[i].animate({opacity:0},function(){this.remove();});
			}
		}
	}
		
	function DrawControls(){
		var linkage = new Linkage(front,{
			stickLength:80, stickJoinLocation:15, stickPivotX:420, stickPivotY:325,
			elevPivotX:770, elevPivotY:275, hornLength:30, elevChord:150, elevThickness:7,
			minAngle:-40, maxAngle:40
		});
	}
	
	/**
		Draw lift arrows to show how the tail changes alpha
		allow the user to drag the stick and change the angle. 
		Plane stays in place
	*/
	
	/**
		Zoom out once again and let the user fly the plane with throttle
	*/
}