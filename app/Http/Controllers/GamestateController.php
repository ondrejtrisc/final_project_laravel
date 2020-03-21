<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Gamestate;
use stdClass;

class GamestateController extends Controller
{
    public function create_initial($game_id, $players)
    {
        $gamestate = new Gamestate();
        $gamestate->game_id = $game_id;
        $gamestate->step = 1;

        $state = new stdClass();
        $state->players = $players;
        $state->territories = [];
        $state->turn = 0;

        $territoryNames = ['brazil', 'argentina', 'peru', 'venezuela'];

        foreach ($territoryNames as $name)
        {
            $territory = new stdClass();
            $territory->name = $name;
            $territory->player = null;
            $territory->units = 0;

            $state->territories[] = $territory;
        }

        $occupiedBy = [];
        foreach ($state->players as $player)
        {
            $occupiedBy[$player] = [];
        }

        //initial distribution of territories (one troop added to each territory)
        $territories = $state->territories;
        shuffle($territories);
        $playerIndex = 0;
        foreach ($territories as $territory)
        {
            $player = $state->players[$playerIndex];
            $territory->player = $player;
            $territory->units = 1;
            $occupiedBy[$player][] = $territory;

            if ($playerIndex === count($state->players) - 1)
            {
                $playerIndex = 0;
            }
            else
            {
                $playerIndex++;
            }
        }

        //distribution of remaining troops
        $initial_units = 15;
        $limit = $initial_units - floor((count($state->territories) / count($state->players)));
        for ($i = 0; $i < $limit; $i++)
        {
            foreach($state->players as $player)
            {                  
                $territory = $occupiedBy[$player][rand(0, count($occupiedBy[$player]) - 1)];
                $territory->units += 1;
            }
        }

        $gamestate->state = json_encode($state);

        $gamestate->save();
    }

    public function get_current_state($game_id) {

        $gamestate = Gamestate::where('game_id', $game_id)->orderBy('step', 'desc')->first();
        return $gamestate->state;
    }

    public function attack($game_id) {

        //gets the most recent gamestate from the database
        $gamestate = Gamestate::where('game_id', $game_id)->orderBy('step', 'desc')->first();
        $state = json_decode($gamestate->state);
        
        //gets the data about the move from the request
        $requestPayload = file_get_contents("php://input");
        $object = json_decode($requestPayload);
        $fromName = $object->attackingTerritory;
        $toName = $object->defendingTerritory;
        $blitz = $object->blitz;

        //locates the attacking territory
        foreach ($state->territories as $territory)
        {
            if ($territory->name === $fromName)
            {
                $fromTerritory = $territory;
                break;
            }
        }

        //locates the defending territory
        foreach ($state->territories as $territory)
        {
            if ($territory->name === $toName)
            {
                $toTerritory = $territory;
                break;
            }
        }

        //battle
        do
        {
            $fromDiceNumber = min($fromTerritory->units - 1, 3);
            $fromDice = [];
            for ($i = 0; $i < $fromDiceNumber; $i++)
            {
                $fromDice[] = rand(1, 6);
            }
            rsort($fromDice);
            
            $toDiceNumber = min($toTerritory->units, 2);
            $toDice = [];
            for ($i = 0; $i < $toDiceNumber; $i++)
            {
                $toDice[] = rand(1, 6);
            }
            rsort($toDice);

            for ($i = 0; $i < min($fromDiceNumber, $toDiceNumber); $i++)
            {
                if ($fromDice[$i] > $toDice[$i])
                {
                    $toTerritory->units -= 1;
                }
                else
                {
                    $fromTerritory->units -= 1;
                }
            }

            if ($toTerritory->units === 0)
            {
                $toTerritory->player = $fromTerritory->player;
                $toTerritory->units = $fromTerritory->units - 1;
                $fromTerritory->units = 1;
                break;
            }
        }
        while ($blitz === 'true' && $fromTerritory->units > 1);
        
        //makes it the next player's turn
        if ($state->turn === count($state->players) - 1)
        {
            $state->turn = 0;
        }
        else
        {
            $state->turn++;
        }

        //creates the new gamestate
        $newGamestate = new Gamestate();
        $newGamestate->game_id = $game_id;
        $newGamestate->step = $gamestate->step + 1;
        $newGamestate->state = json_encode($state);

        //saves the new gamestate to the database
        $newGamestate->save();

        //returns the new state to the frontend
        return json_encode($state);
    }


    /*a method for testing purposes - to create a new game make a GET request at /initialize/{game_id} with a fresh game_id*/
    public function initialize($game_id) {

        $this->create_initial($game_id, [1, 2]);
        return $this->get_current_state($game_id);
    }
}
