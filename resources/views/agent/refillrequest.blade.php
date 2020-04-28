@extends('layouts.master')
@section('title','Refill Request')
@section('content')
@parent
@section('page-header','Refill Request')
<section class="container">
    <div class="row">
      <div class="col-12">
  @if(Session::has('message'))
    <div class="alert message {{ Session::get('alert-class', 'alert-info') }}">{{ Session::get('message') }}</div>
  @endif
  <form class="well form-horizontal" action="{{route('agent.do-refillrequest')}}" method="post" id="refill_request">
    {{ csrf_field() }}
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Mobile Number</label>
            <div class="col-sm-10">
                <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-earphone"></i></span>
                    <input name="refill_no" class="form-control" type="text">
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Account Type</label>
            <div class="col-sm-10 selectContainer">
                <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-list"></i></span>
                    <select name="account_type" class="custom-select" required>
                        <option value="">Select your account type</option>
                        <option value="1">Prepaid</option>
                        <option value="2">Postpaid</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Operator Type</label>
            <div class="col-sm-10 selectContainer">
                <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-list"></i></span>
                    <select name="operator_type" class="custom-select" required>
                        <option value="">Select your operator</option>
                        <option value="1">Grameenphone</option>
                        <option value="2">Banglalink</option>
                        <option value="3">Airtel</option>
                        <option value="4">Robi</option>
                        <option value="5">Teletalk</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Amount</label>
            <div class="col-sm-10 inputGroupContainer">
                <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-earphone"></i></span>
                    <input name="amount" class="form-control" type="text" required>
                </div>
            </div>
        </div>
        <!-- Button -->
        <div class="form-group row">
            <label class="col-sm-2 col-form-label"></label>
            <div class="col-sm-10">
                <button type="button" class="btn btn-primary" id="refilltopup-submit">SUBMIT <span class="glyphicon glyphicon-send"></span></button>
            </div>
        </div>
</form>
</div>
</section>
@endsection


@section('pageJs')
<script type="text/javascript">
"use strict";
$('#refilltopup-submit').click(function(e){
    e.preventDefault();
    var form = $(this).parents('form');
    form.validate({
        rules: {
            refill_no : {
                required: true,
                number:true,
                minlength: 11,
            },
            amount : {
                required: true,
                number:true,
            },
            account_type: {
                required: true,
            },
            operator_type: {
                required: true,
            }

        },
        messages: {
            refill_no: {
                required: "Please enter your number",
                minlength: "Number can not be less than 11",
            },
            amount: {
                required: "Please enter your amount",
            },
            account_type: {
                required: "Please enter your acount type",
            },
            operator_type: {
                required: "Please enter your operator type",
            }
        }
    });
    Swal.fire({
    title: 'Are you sure to request?',
    //text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm'
    }).then((result) => {
        if (result.value) {
            form.submit();
        }
    })
});
</script>
@endsection