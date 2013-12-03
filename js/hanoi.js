// hanoi.js


/**
 * 
 * This JavaScript file handles the logic required to run the Towers of Hanoi on a webpage.
 * It drags image objects and drops them into <table> tags, processing all the information that
 * such action entails.
 * 
 * @author Antonio Recalde
 * @version 12/01/2013
 */

const MAX_SIZE = 7;									// This is the maximum number of blocks the game can start with.
var number_of_moves;								// This variable will store the number of moves the user has made so far.
var min_moves = [0, 1 , 3, 7, 15, 31, 63, 127];		// Holds value of minimum number of moves, in which it's possible to win the game
image_objects = new Array();						// This variable will hold all the image objects in the game



/*---------------------------------------------------------------------------
 * 
 * This for loop will retrieve references in memory to the objects used to play this game. The purpose of this is that when restarting
 * the game, all blocks in all positions shall be deleted... thus, we need to keep a pointer to those objects so we can reload the towers in 
 * their initial position
 * 
 *---------------------------------------------------------------------------*/
for (var i = 0; i < MAX_SIZE; i++)
	image_objects[i] = $("#level" + i).get();


/*
 * Starting game object, and saving a reference to in in a variable $game. When the game gets restarted, a new TowersOfHanoi object will be created
 * and the previous object (from the old game) shall be de-refereced and set for garbage collection. Thus, only one instance of the game
 * will be running at a time. 
 *  
 */ 
var $game = new TowersOfHanoi("start");
	

/**
 * 	This function runs the game. Makes the moves based on the information acquired via the listeners  draggable 
 * 	and droppable. 
 * 
 * @param size
 * @returns
 */
function TowersOfHanoi(size)
{	
	var obj = null;								// this will be used to refer to the object currently being dragged outside the drag function.
	var game_end = false;						// this boolean indicates whether end of game code should be executed or not.
	const GAME_SIZE = size == "start" ? MAX_SIZE : size;
	const NUM_TOWERS = 3;				
	var origin = null;							// keeps track of the tower a moving block originated from
	
	number_of_moves = 0;
	
	/*------------------------------------------------------
	 * 
	 * These "tower" arrays will keep track of the coordinates of each element.
	 * They will store the id value of the objects that occupy each position.
	 * 
	 * These arrays allow for the retrieval of object id's by position.
	 * 
	 *-----------------------------------------------------*/
	tower = [];
	tower["A"] = new Array();
	tower["B"] = new Array();
	tower["C"] = new Array();
	
	// allows for the retrieval of coordinates by object id.
	var pos = [];								
	
	
	initialize();								
	
	
	$(function() {
	    $( '.draggable' ).draggable({
	    	containment: '#game', 
	    	revert: "invalid",
	    	start: function() {
	    		if (game_end)					// disables movement of blocks when game has been finished
	    			return false;
	    		
	    		// Ensures that the user cannot drop in the same tower it came from. Instead, it simply reverts back.
	    		$('#' + pos[this.id][0]).droppable("disable");		
	    		
	    		
	    		// The following for loop prevents that a block be dropped on top of a smaller block.
	    		for (var t in tower)
	    		{
	    			top_level = tower[t].length - 1;
	    			
	    			// compares ids.. if the object's id is heigher than the tower's highest element id, the drop is disabled.. Thus, you cannot drop on top of a smaller block. 
	    			if (this.id <= tower[t][top_level])
	    				$("#" + t).droppable("disable");			
	    		}
	    		
	    		// Ensures that the block is draggable only if its in the top of its tower.
	    		if (!(this.id == tower["A"][ (tower["A"].length - 1) ] || this.id == tower["B"][(tower["B"].length - 1)] || this.id == tower["C"][(tower["C"].length - 1)]))
	    			return false;
	    		
	    		obj = this;							// save reference to the object being dragged
	    	}, // end start: function
	    	
	    	stop: function() {
	    		for (var t in tower)				// restores droppable to all towers once the move is finalized
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
	
	/**
	 * This function sets up the game in its initial position
	 */
	function initialize()
	{
		/*
		 * If the game has been restarted, delete all blocks from all cells.
		 */
		if (size != "start")						
		{
			for (var index in tower)
			{
				for (var i = 0; i < MAX_SIZE; i++)
					$("#" + index + i).html("");
			}
		}
		
		
		/*
		 * Place all the blocks in their initial position. Only place as many blocks as the game size.
		 */
		for (var i = 0; i < (GAME_SIZE); i++)
		{
				pos['level' + i] = ['A', i, 'A'+i];				// save the position of the object given the object id.
				tower["A"][i] = 'level' + i;					// now save the id of each object in relation to its position.
				
				if (size !=  "start")
					$("#A" + i).html(image_objects[i]);			// if the game is restarting, reload the cells with blocks depending on GAME_SIZE
		}
		$("#min").html(min_moves[GAME_SIZE]);					// set the min div to its corresponding value (minimum number of moves to finish the game)
		$("#curr").html(number_of_moves);						
	}
	
	/**
	 * This function processes the data gathered by the droppable() method in order to produce the effects of a block move
	 * 
	 * @param target
	 */
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
					'Best possible: ' + min_moves[GAME_SIZE] + '.');
		}
	}
	/**
	 * Updates arrays keeping track of the blocks positions, and updates its destination <td>'s html field with the object just moved
	 * 
	 * @param obj
	 * @param target
	 */
	function addToTower(obj, target)
	{
		var height;
		// here
		height = tower[target].length;						// get the height of the tower we are moving the block onto
		
		destination_row = "" + target + height;				// this should equal is the <td> destination's id
		$('#' + obj.id).css({'left': 0, 'top': 0});			// ensures image stays inside of <td>
		$('#' + destination_row).html(obj);					// this moves the block into the desired <td>
		
	
		pos[obj.id] = [target, height, destination_row];	// update position of object
		tower[target][height] = tower[origin].pop();		// pop last element from origin array, and place it in the new array it just got moved into
	}
} // end of TowersOfHanoi()	
	
	/*-----------------------------------------------------------------------
	 * 
	 * The next segment of code listens for clicks on the "New Game" button.
	 * Then, it creates a new TowersOfHanoi object with the size picked via a dropdown list.
	 * This, will start a new game with "new_size" blocks.
	 * 
	 *----------------------------------------------------------------------*/
	$(document).ready(function(){ 
	    $("button").click(function () {
	        var new_size = $("select[name=size]").val();	// the the value selected in the drop down list
	        $game = new TowersOfHanoi(new_size);			// starts new game
	    });
	});
