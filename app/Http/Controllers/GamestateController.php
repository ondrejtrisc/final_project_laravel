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
            $territory->force = 0;

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
            $territory->force = 1;
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
        $initial_force = 5;
        $limit = $initial_force - floor((count($state->territories) / count($state->players)));
        for ($i = 0; $i < $limit; $i++)
        {
            foreach($state->players as $player)
            {                  
                $territory = $occupiedBy[$player][rand(0, count($occupiedBy[$player]) - 1)];
                $territory->force += 1;
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

        $gamestate = Gamestate::where('game_id', $game_id)->orderBy('step', 'desc')->first();
        
        $requestPayload = file_get_contents("php://input");
        $object = json_decode($requestPayload);
        
        $fromName = $object->attackingTerritory;
        $toName = $object->defendingTerritory;
        $state = json_decode($gamestate->state);

        foreach ($state->territories as $territory)
        {
            if ($territory->name === $fromName)
            {
                $fromTerritory = $territory;
                break;
            }
        }

        foreach ($state->territories as $territory)
        {
            if ($territory->name === $toName)
            {
                $toTerritory = $territory;
                break;
            }
        }

        if ($fromTerritory->force > $toTerritory->force)
        {
            $toTerritory->force -= 1;
        }
        else
        {
            $fromTerritory->force -= 1;
        }

        if ($toTerritory->force === 0)
        {
            $toTerritory->player = $fromTerritory->player;
            $toTerritory->force = $fromTerritory->force - 1;
            $fromTerritory->force = 1;
        }

        if ($state->turn === count($state->players) - 1)
        {
            $state->turn = 0;
        }
        else
        {
            $state->turn++;
        }

        $newGamestate = new Gamestate();
        $newGamestate->game_id = $game_id;
        $newGamestate->step = $gamestate->step + 1;
        $newGamestate->state = json_encode($state);

        $newGamestate->save();

        return json_encode($state);
    }


    /*a method for testing purposes - to create a new game make a GET request at /initialize/{game_id} with a fresh game_id*/
    public function initialize($game_id) {

        $this->create_initial($game_id, [1, 2]);
        return $this->get_current_state($game_id);
    }
}
