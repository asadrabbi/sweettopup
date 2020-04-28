<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use App\Agent;
use Session;
class UpdateprofileController extends Controller
{
    public function index(){
        if(Auth::guard('agent')->check()){
            return view('agent.accountsettings');
        }else{
            return redirect()->route('agent.show-login');
        }
    }

    public function postUpdateprofile (Request $request){

        $passwordswitch = $request->passwordswitch;
        $oldPassword = $request->inputPasswordOld;
        $newPassword = $request->inputPasswordNew;
        $verifyNewPassword = $request->inputPasswordNewVerify;
        $id = Auth::guard('agent')->user()->id;
        $currentPassword = Auth::guard('agent')->user()->client_password;
        $fullname = $request->fullname;
        $email = $request->email;
        $password = md5($oldPassword);

        if($password != $currentPassword){
            Session::flash('message', 'You have entered a Wrong Password!'); 
            Session::flash('alert-class', 'alert-danger'); 
            return redirect()->route('agent.show-profile');
        }else{
            $profile = Agent::find($id);
            //dd($profile);
            if($passwordswitch == 1){
                if($newPassword == $verifyNewPassword){
                    $md5password = md5($newPassword);
                    $profile->client_password = $md5password;
                }
            }else{
                $profile->client_full_name = $fullname;
                $profile->client_email = $email;
            }
            try {

                $profile->save();

                Session::flash('message', 'Profile successfully updated!'); 
                Session::flash('alert-class', 'alert-success'); 
                return redirect()->route('agent.show-profile');
            } catch (\Exception $e) {
                Session::flash('message', $e->getMessage()); 
                Session::flash('alert-class', 'alert-success'); 
                return redirect()->route('agent.show-profile');
                //return $e->getMessage();
            }
        }

    }
}