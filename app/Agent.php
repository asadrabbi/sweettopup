<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Agent extends Authenticatable
{
    use Notifiable;
    protected $table = "client";

    protected $guard = 'client';

    public $timestamps = false;

    protected $fillable = [
        'client_id', 'client_password',
    ];

    public function getAuthPassword()
    {
        return $this->client_password;
    }
    public function parent() { 
        
        return $this->belongsTo('App\Agent','client_parent_id','id')->select('client_parent_id','id')->with('parent');
    }

    //protected $hidden = [
        //'password', 'remember_token',
    //];
}
