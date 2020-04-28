<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Agent;
use App\Inetloadfdr;
use Auth;
class DashboardController extends Controller
{
    public function index(){
        if(Auth::guard('agent')->check()){
            $agentdata = Agent::where('id',Auth::guard('agent')->user()->id)->get();
            //dd(Inetloadfdr::select('inetload_phn_no')->where('operator_type_id',2)->groupBy('inetload_phn_no')->orderByRaw('COUNT(*) DESC')->limit(1)->get());
            
            return view('agent.dashboard', ['agentdata'=>$agentdata]);
        }else{
            return redirect()->route('agent.show-login');
        }
    }

}
