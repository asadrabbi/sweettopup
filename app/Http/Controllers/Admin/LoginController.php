<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function index(){

        return view('admin.auth.login');
    }

    public function postLogin(Request $request){
        
        if(Auth::check()){

        }else{
            if (Auth::attempt(
                [
                    'user_id' => $request->user_id,
                    'password' => $request->password
                ]
                )
            ) {
                return redirect()->route('admin.dashboard');
            }else{
                echo "Login Failed";
            }
        }
    }
}
