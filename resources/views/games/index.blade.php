@extends('layouts.app')

@section('content')

<style>
  td{
    padding: 0.5em;
    margin: 0.5em;
  }

  form{
    padding: 0;
  }


</style>

@if (Route::has('login'))
<div class="top-right links">
    @auth
        <a href="{{ url('/home') }}">Home</a>
    @else
        <a href="{{ route('login') }}">Login</a>

        @if (Route::has('register'))
            <a href="{{ route('register') }}">Register</a>
        @endif
    @endauth
</div>
@endif

<h1>Join one of the games below</h1>
<form action="{{ action('GameController@create') }}" method="get">
  <button type="submit">Or create a new game</button>
</form>  
<table>
  <thead>
    <th>ID</th>
    <th>Founder</th>
    <th>Players</th>
    <th>Maximum players</th>
    <th>Status</th>
  </thead>
  <tbody>
    @foreach ($games as $game)
      <tr>
        <td>{{$game->id}}</td>
        <td>{{$game_users[$game->id][0]->name}}</td>
        <td>
          @foreach($game_users[$game->id] as $u)
            {{$u->name}} <br>
          @endforeach
        </td>
        <td>{{$game->max_players}}</td>
        <td>
          {{-- @if(array_search(\Auth::user(), $game_users))
            {{'you joined this game'}}
          @else
            {{$game->status}}
          @endif --}}
        </td>
        <td>
          <div style="display: flex">
            @if($game->status != 'launched')
              <div class="btn-div">
                <form action="{{ action('GameController@show', [$game->id]) }}" method="get">
                  @csrf
                  {{-- <input type="hidden" name="user" value={{\Auth::id}}> --}}
                  <button type="submit">Show</button>
                </form>
              </div>
              <div class="btn-div">
                @if(Auth::user()->id != $game->founder_user_id && $num_users[$game->id]<$game->max_players)
                  <form action="{{ action('GameController@update', [$game->id]) }}" method="post">
                    @csrf
                    {{-- <input type="hidden" name="user" value={{\Auth::id}}> --}}
                    <button type="submit">Join</button>
                  </form>
                @endif
              </div>
              <div class="btn-div">
                @if(Auth::user()->id == $game->founder_user_id)  
                  <form action="{{ action('GameController@delete', [$game->id]) }}" method="post">
                    @method("delete")
                    @csrf
                    <button type="submit">Delete</button>
                  </form>
                @endif
              </div>
              <div>
                @if(Auth::user()->id == $game->founder_user_id)  
                {{-- {{dd($num_users[$game->id])}} --}}
                  @if($num_users[$game->id] == $game->max_players)
                    <form action="{{ action('GameController@launch', [$game->id]) }}" method="post">
                      @csrf
                      <button type="submit">Launch the game</button>
                    </form>
                  @endif
                @endif
              </div>
            @else
              @if(array_search(\Auth::user(), $game_users[$game->id]) > -1)
                <form action="{{ action('GamestateController@get_current_state', [$game->id]) }}" method="get">
                  <button type="submit">Play</button>
                </form>
              @endif  
            @endif
          </div>
        </td>
      </tr>
    @endforeach
  </tbody>
</table>

@endsection