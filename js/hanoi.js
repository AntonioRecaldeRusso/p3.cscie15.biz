const MAX_SIZE = 7;
	var number_of_moves;
	var minimum_number_of_moves = [0, 1 , 3, 7, 15, 31, 63, 127];
	image_objects = new Array();
	var obj = null;
	
	for (var i = 0; i < MAX_SIZE; i++)
		image_objects[i] = $("#level" + i).get();
	
	
	var $game = new TowersOfHanoi("start");
	
	function TowersOfHanoi(size)
	{	
		var game_end = false;
		const GAME_SIZE = size == "start" ? MAX_SIZE : size;
		const NUM_TOWERS = 3;
		var origin = null;
		
		number_of_moves = 0;
		
		tower = [];
		tower["A"] = new Array();
		tower["B"] = new Array();
		tower["C"] = new Array();
		
		var pos = [];				// store the last position of each block in array pos
		
		initialize();
		
		$(function() {
		    $( '.draggable' ).draggable({
		    	containment: '#game', 
		    	revert: "invalid",
		    	start: function() {
		    		if (game_end)
		    			return false;
		    		
		    		$('#' + pos[this.id][0]).droppable("disable");		// cannot drop in origin tower
		    		
		    		// do not drop over smaller....
		    		for (var t in tower)
		    		{
		    			top_level = tower[t].length - 1;
		    			
		    			if (this.id <= tower[t][top_level]) // if this is not bigger than peak ABC, disable draggable
		    				$("#" + t).droppable("disable");
		    		}
		    		
		    		if (!(this.id == tower["A"][ (tower["A"].length - 1) ] || this.id == tower["B"][(tower["B"].length - 1)] || this.id == tower["C"][(tower["C"].length - 1)]))
		    			return false;
		    		
		    		obj = this;
		    	}, // end start: function
		    	
		    	stop: function() {
		    		for (var t in tower)				// restore droppable in all towers
		    			$('#' + t).droppable("enable");
		    		
		    	}
		    }
	 	);
		    $( ".droppable" ).droppable({
		    	activeClass: "active",
		    	drop: function() {
		    		processMove(this.id);
		    	}
		    });
		});
			
		function initialize()
		{
			if (size != "start")
			{
				for (var letter in tower)
				{
					for (var i = 0; i < MAX_SIZE; i++)
						$("#" + letter + i).html("");
				}
			}
			
			
			for (var i = 0; i < (GAME_SIZE); i++)
			{
					pos['level' + i] = ['A', i, 'A'+i];		// [0] current tower, [1] the current level.
					tower["A"][i] = 'level' + i;
					
					if (size !=  "number")
						$("#A" + i).html(image_objects[i]);
			}
			
			$("#min").html(minimum_number_of_moves[GAME_SIZE]);
			$("#curr").html(number_of_moves);
		}
			
		function processMove(target)
		{
			origin = pos[obj.id][0];
			addToTower(obj, target);
			
			$("#curr").html(++number_of_moves);
			
			if (tower["C"].length == GAME_SIZE)
			{
				game_end = true;
				alert('\tYOU WIN!!\n' +
						'To play again click the "New Game" button.\nYou finished this puzzle in ' + number_of_moves + ' move(s).\n' + 
						'Best possible: ' + minimum_number_of_moves[GAME_SIZE] + '.');
			}
		}
		
		function addToTower(obj, target)
		{
			var height;
			// here
			height = tower[target].length;		
			
			destination_row = "" + target + height;
			$('#' + obj.id).css({'left': 0, 'top': 0});			// ensures image stays inside of <td>
			$('#' + destination_row).html(obj);
			
		
			pos[obj.id] = [target, height, destination_row];
			tower[target][height] = tower[origin].pop();
			
			
			pos[obj.id] = [target, height, destination_row];		// update the position coordinates of the element just dropped
		}
	}	
	
	$(document).ready(function(){ 
	    $("button").click(function () {
	        var new_size = $("select[name=size]").val();
	        $game = new TowersOfHanoi(new_size);
	    });
	});
