<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Agent;
use Auth;
class LoginController extends Controller
{
    public function index(){
        return view('agent.auth.login');
    }

    public function postLogin(Request $request){

        
        
        if(Auth::guard('agent')->check()){
            return redirect()->route('agent.dashboard');
        }else{
            
            if (Auth::guard('agent')->attempt(
                [
                    'client_id' => $request->username,
                    'password' => $request->password
                ]
            )) {
                return redirect()->route('agent.dashboard');
            }else{
                return redirect()->route('agent.show-login');
            }
        }
    }

    public function logout(Request $request)
    {

        Auth::guard('agent')->logout();

        $request->session()->flush();

        $request->session()->regenerate();

        return redirect()->route('agent.show-login');
    }
}
