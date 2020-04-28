@extends('layouts.master')
@section('title','Balance Transfer Request')
@section('content')
@parent
@section('page-header','Balance Transfer Request')
<section class="container">
    <div class="row">
      <div class="col-12">
  @if(Session::has('message'))
    <div class="alert message {{ Session::get('alert-class', 'alert-info') }}">{{ Session::get('message') }}</div>
  @endif
  <form class="well form-horizontal" action="{{route('agent.do-btrequest')}}" method="post" id="bt_request">
    {{ csrf_field() }}
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Mobile Number</label>
            <div class="col-sm-10">
                <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-earphone"></i></span>
                    <input name="refill_no" class="form-control" type="text" required>
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
                        <option value="1">Personal</option>
                        <option value="2">Agent</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Transfer Type</label>
            <div class="col-sm-10 selectContainer">
                <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-list"></i></span>
                    <select name="transfer_type" class="custom-select" required>
                        <option value="">Select your transfer type</option>
                            <option value="1">bKash</option>
                            <option value="2">DBBL</option>
                            <option value="3">mCash</option>
                            <option value="4">OK</option>
                            <option value="5">Ucash</option>
                            <option value="6">Primecash</option>
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
                <button type="button" class="btn btn-primary" id="btrequest-submit">SUBMIT <span class="glyphicon glyphicon-send"></span></button>
            </div>
        </div>
</form>
</div>
</section>
@endsection


@section('pageJs')
<script type="text/javascript">
"use strict";
$('#btrequest-submit').click(function(e){
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
            transfer_type: {
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
            transfer_type: {
                required: "Please enter your transfer type",
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