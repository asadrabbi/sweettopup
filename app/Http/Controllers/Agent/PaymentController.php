<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\IndexTrait;
use App\Agent;
use App\Inetloadfdr;
use Auth;
use Carbon\Carbon;
class PaymentController extends Controller
{
    use IndexTrait;
    protected $searchField;
    protected $enableSearch;

    function __construct() {
        $this->enableSearch = true;
        $this->searchField = [
            'payment_type_id' => [
                'wrapper_class' =>'col-md-4 mt-3',
                'type'=>'select',
                'label' => 'Operator',
                'class' => 'custom-select',
                'query'=>'LIKE',
                'append'=> '%',
                'direction'=>'right',
                'options' => array(''=>'Select Payment Type','1'=>'Grameenphone','2'=>'Banglalink','3'=>'Airtel','4'=>'Robi','5'=>'Teletalk','6'=>'Citycell')
            ],
            'inetload_phn_no' => [
                'type'=>'text',
                'label' => 'Phone No',
                'placeholder' => 'Enter Mobile No.',
                'wrapper_class' =>'col-md-4',
                'default' => '',
                'query'=>'LIKE',
                'append'=> '%',
                'direction'=>'both',
                'default' => ''
            ],
            'inetload_amount' => [
                'wrapper_class' =>'col-md-4',
                'type'=>'text',
                'label' => 'Amount',
                'placeholder' => 'Enter Amount',
                'query'=>'LIKE',
                'append'=> '%',
                'direction'=>'right',
                'default' => ''
            ],
            'inetload_time_start' => [
                'type'=>'date',
                'label' => 'Date From',
                'placeholder' => 'Select Start Date',
                'wrapper_class' =>'col-md-4 mt-3',
                'default' => '',
                'query'=>'LIKE',
                'append'=> '%',
                'direction'=>'both',
                'default' => ''//Carbon::now()->add(-1,'day'),
            ],
            'inetload_time_end' => [
                'type'=>'date',
                'label' => 'Date To',
                'placeholder' => 'Select End Date',
                'wrapper_class' =>'col-md-4 mt-3',
                'default' => '',
                'query'=>'LIKE',
                'append'=> '%',
                'direction'=>'both',
                'default' => ''//Carbon::now(),
            ],
        ];
    }
    public function index(Request $request)
    {
        if (Auth::guard('agent')->check())
        {
            if ($request->wantsJson())
            {

                //getting Perpage Number From Request
                $perPage = 10;
                if ($request->has('pagination'))
                {
                    $pagination = $request->get('pagination');
                    if (array_key_exists('perpage', $pagination) && is_numeric($pagination['perpage']))
                    {
                        $perPage = $pagination['perpage'];
                    }
                }

                $id = Auth::guard('agent')->user()->id;

                list($sortField, $sortDirection) = $this->getSortDirections($request);

                $iNetLoadData = Inetloadfdr::where('inetload_from_user_id', $id)->where('inetload_to_user_id', $id)->whereInetloadStatus('1')
                    ->where('account_type','!=', '0') /*->whereBetween('inetload_time', array('1271012422000', '1586631622000'))*/
                    ->orderBy($sortField, $sortDirection)->with('agent');

                //dd($iNetLoadData);

                //Lest Make Search Query Here
                //Set $this->enableSearch to TRUE to enable query
                if ($this->enableSearch)
                {
                    $iNetLoadData = $this->makeSearchQuery($iNetLoadData, $request);
                }

                $iNetLoadData = $iNetLoadData->paginate($perPage, ['*'], 'null', $request->pagination['page']);
                //dd($iNetLoadData->);
                return response()
                    ->json($this->makeResponse($iNetLoadData, $perPage));

            }
            return view('agent.pendingbt')->with('searchField', $this->searchField);
        }
        else
        {
            return redirect()->route('agent.show-login');
        }
    }
 
}
