<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    public function users(){
        return $this->hasOne(User::class); 
    }
}
