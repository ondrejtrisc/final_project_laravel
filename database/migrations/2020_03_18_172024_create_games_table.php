<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('founder_user_id');
            $table->string('users_ids')->nullable();   // an array of all players ids
            // $table->unsignedInteger('second_user_id')-nullable();
            // $table->unsignedInteger('third_user_id')-nullable();
            // $table->unsignedInteger('fourth_user_id')-nullable();
            // $table->unsignedInteger('fifth_user_id')-nullable();
            // $table->unsignedInteger('sixth_user_id')-nullable();
            $table->unsignedInteger('max_players')->nullable(); 
            $table->string('status')->nullable();   //'can join', 'ready to start', 'now playing', 'finished'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('games');
    }
}
