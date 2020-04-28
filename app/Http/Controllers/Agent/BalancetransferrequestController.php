<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Agent;
use App\Inetloadfdr;
use App\Settings;
use App\Btsurcharge;
use Auth;
use Session;
use Carbon\Carbon;

class BalancetransferrequestController extends Controller
{
    public function index(){
        if(Auth::guard('agent')->check()){
            return view('agent.btrequest');
        }else{
            return redirect()->route('agent.show-login');
        }
    }

    public function postBalancetransferrequest(Request $request){
        //dd($request);

        if(Auth::guard('agent')->check()){
            $mobile = $request->refill_no;
            $amount = $request->amount;
            $accountType = $request->account_type;
            $transferType = $request->transfer_type;
            $id = Auth::guard('agent')->user()->id;
            $clientType = Auth::guard('agent')->user()->client_type_id;
            $clientId = Auth::guard('agent')->user()->client_id;
            $clientBalance = Auth::guard('agent')->user()->client_credit_all;
            $settings = Settings::all('prepaid_min_refill_amount','postpaid_min_refill_amount','prepaid_max_refill_amount','postpaid_max_refill_amount','same_number_refill_interval');
            $prepaidMin = $settings[0]->prepaid_min_refill_amount;
            $prepaidMax  = $settings[0]->prepaid_max_refill_amount;
            $postpaidMin = $settings[0]->postpaid_min_refill_amount;
            $postPaidMax = $settings[0]->postpaid_max_refill_amount;
            $sameNumberInterval = $settings[0]->same_number_refill_interval;

            //--Get Surcharge amount
            $btsurcgarge = Btsurcharge::all('bt_type_id','bt_min_amount','bt_max_amount','bt_surcharge_amount');
            $btTypeId = $btsurcgarge[0]->bt_type_id;
            $btMinAmount = $btsurcgarge[0]->bt_min_amount;
            $btMaxAmount = $btsurcgarge[0]->bt_max_amount;
            $btSurcgargeAmount= $btsurcgarge[0]->bt_surcharge_amount;

            $sameNumberInQue = false;

            $sameNumberLastRequestTime = Inetloadfdr::latest('inetload_time')->where('inetload_phn_no','LIKE','%'.$mobile.'%')->pluck('inetload_time')->first();
            $current_timestamp = round(microtime(true) * 1000);
            $x = Carbon::createFromTimestamp($sameNumberLastRequestTime/1000);
            
            $y = Carbon::createFromTimestamp($current_timestamp/1000);
            $totalDifference = $y->diffInMinutes($x);
            //dd($totalDuration);
            //$timeDifference = 5;
            
            $parents = Auth::guard('agent')->user()->parent->toArray();
            $levelTree = array();
            $x = 0;
            foreach($parents as $key => $value){
                if($key == 'parent' && $value != null){
                    $this->getParent($value, $levelTree, $x); 
                }else{
                    $levelTree[$x]['id'] = $value;
                    $levelTree[$x]['type'] = 1;
                    $x++;
                }
            }
            $levelTree [$x]['id']= $id;
            $levelTree [$x]['type']= $clientType;
            //dd($levelTree);
            $sameNumberLastRequestTime = 1;
            if($amount >= $btMinAmount && $amount <= $btMaxAmount){
                $totalCharge = $amount / (100*$btSurcgargeAmount);
                $totalPay = $amount + $totalCharge;
                if($totalPay <= $clientBalance){
                    $ipAddress = 'd:'.$request->ip();
                    $marker = $current_timestamp.':'.$mobile;
                    foreach($levelTree as $level){
                        $levelID = $level['id'];
                        Inetloadfdr::create(['operator_type_id' => 8, 'inetload_from_user_id' => $id, 'inetload_from_client_type_id' => $clientType, 'inetload_to_user_id'=> $levelID, 'inetload_to_client_type_id' => $level['type'], 'inetload_phn_no'=> $mobile, 'inetload_type_id'=> 1, 'inetload_amount' => $amount, 'inetload_time' => $current_timestamp, 'inetload_marker' => $marker, 'inetload_status' => 1, 'account_type' => $accountType,'surcharge' => $totalCharge, 'client_ip' => $ipAddress]);
                    }

                    $profile = Agent::find($id);
                    $newBalance = $clientBalance - $totalPay;
                    $profile->client_credit_all = $newBalance;
                    $profile->save();

                    Session::flash('message', 'Request Successfull!'); 
                    Session::flash('alert-class', 'alert-success');
                }
                else{
                    Session::flash('message', 'Low Balance!'); 
                    Session::flash('alert-class', 'alert-danger');
                }
            }
            else{
                Session::flash('message', 'Sorry! You did not meet the limit criteria!'); 
                Session::flash('alert-class', 'alert-danger');
            }
            return redirect()->route('agent.show-btrequest');
        }else{ 
            return redirect()->route('agent.show-login');
        }
    }

    public function getParent($parents,$levelTree, $x ){
        foreach($parents as $key => $value){
            if($key == 'parent' && $value != null){
                $this->getParent($value, $levelTree,$x); 
            }else{
                $levelTree[$x]['id'] = $value;
                $levelTree[$x]['type'] = 1;
                $x++;
            }
        }

        return $levelTree;
    }
}
