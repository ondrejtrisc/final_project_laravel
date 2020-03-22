@extends('layouts.app')

@section('content')


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

<h3>Game #{{$game->id}}</h3>
<p><strong>Founder: </strong>{{$usernames_arr[$game->founder_user_id]}}</p>
<p><strong>Players: </strong><br> 
  @foreach($game_users as $u)
    <p>
      {{$u->name}}
    </p>
  @endforeach
</p>
<p><strong>Maximum number of players: </strong>{{$game->max_players}}</p>

{{-- <p><strong>Status: </strong>
  @if(array_search(\Auth::user(), $game_users))
    {{'you joined this game'}}
  @else
    {{$game->status}}
  @endif --}}
{{-- </p> --}}

@if($game->status != 'launched')

  @if(Auth::user()->id == $game->founder_user_id)  
    @if($num_users == $game->max_players)
      <form action="{{ action('GameController@launch', [$game->id]) }}" method="post">
        @csrf
        <button type="submit">Launch the game</button>
      </form>
    @else
      {{-- {{'wait other users to join'}} --}}
    @endif
  @endif

  @if($u == \Auth::user() && Auth::user()->id != $game->founder_user_id)
    <form action="{{ action('GameController@leave', [$game->id]) }}" method="post">
      @csrf
      <button type="submit">Leave this game</button>
    </form>
  @endif

  @if(Auth::user()->id != $game->founder_user_id && $num_users < $game->max_players)
    <form action="{{ action('GameController@update', [$game->id]) }}" method="post">
      @csrf
      <button type="submit">Join</button>
    </form>
  @endif

  @if(Auth::user()->id == $game->founder_user_id)  
    <form action="{{ action('GameController@delete', [$game->id]) }}" method="post">
      @method("delete")
      @csrf
      <button type="submit">Delete</button>
    </form>
  @endif

@else

  @if(array_search(\Auth::user(), $game_users[$game->id]) > -1)
    <form action="{{ action('GamestateController@get_current_state', [$game->id]) }}" method="get">
      <button type="submit">Play</button>
    </form>
  @endif  

@endif

<form action="{{ action('GameController@index') }}" method="get">
  @csrf
  <button type="submit">Back to list of games</button>
</form>

@endsection