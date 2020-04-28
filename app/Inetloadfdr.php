<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Agent;
class Inetloadfdr extends Model
{
    protected $table = "inetload_fdr";
    public $timestamps = false;
    
    protected $fillable = ['operator_type_id', 'inetload_from_user_id', 'inetload_from_client_type_id', 'inetload_to_user_id','inetload_to_client_type_id', 'inetload_phn_no', 'inetload_type_id', 'inetload_amount','inetload_time', 'inetload_marker', 'inetload_status', 'surcharge','account_type','client_ip'];

    public function agent(){
        return $this->belongsTo(Agent::class,'inetload_from_user_id','id');
    }
}
