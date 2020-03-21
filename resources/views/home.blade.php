@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header"></div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    @auth
                        <h2>Hi {{ Auth::user()->name }}, let's play!)</h2>
                        <form action="" method="get">
                            <button type="submit">User settings</button>
                        </form>  
                        <form action="{{ action('GameController@create') }}" method="get">
                            <button type="submit">Create a new game</button>
                        </form>  
                        <form action="{{ action('GameController@index') }}" method="get">
                            <button type="submit">Go to the game list</button>
                        </form>  
                    @endauth
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
