@extends('layouts.app')

@section('content')

<h3>Create a new game</h3>
<form action="{{ action('GameController@store')}}" method="post"> 
  @csrf
  <label>Number of players:</label>
  <select name="max_players"><br>
      <option value="2">2</option>    
      <option value="3">3</option>    
      <option value="4">4</option>    
      <option value="5">5</option>    
      <option value="6">6</option>    
  </select><br>
  <button type="submit">Create game</button>
</form>
<form action="{{ action('GameController@index') }}" method="get">
  @csrf
  <button type="submit">Back to list of games</button>
</form>

@endsection
