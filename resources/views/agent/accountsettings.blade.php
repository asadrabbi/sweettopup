@extends('layouts.master')
@section('title','Update Profile')
@section('content')
@parent
@section('page-header','Update Profile')
@php
$client = [1=>'Reseller',2=>'Agent'];
$status = [1=>'Active',2=>'Inactive'];
@endphp
<div class="col-12 col-md-12">
  @if(Session::has('message'))
    <div class="alert message {{ Session::get('alert-class', 'alert-info') }}">{{ Session::get('message') }}</div>
  @endif
    <form class="well form-horizontal" action="{{route('agent.do-updateprofile')}}" method="post" id="update_profile">
        {{ csrf_field() }}
        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="client_id">Client ID</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" id="client_id" name="client_id" value="{{ auth()->guard('agent')->user()->client_id}}" required="" disabled>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="client_id">Client Type</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" id="client_type" name="client_type" value="{{ $client[auth()->guard('agent')->user()->client_type_id]}}" required="" disabled>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="client_id">Status</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" id="status" name="status" value="{{ $status[auth()->guard('agent')->user()->client_status]}}" required="" disabled>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="fullname">Full Name</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" id="fullname" name="fullname" value="{{ auth()->guard('agent')->user()->client_full_name}}" required="">
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="fullname">Email</label>
            <div class="col-sm-10">
            <input type="email" class="form-control" id="email" name="email" value="{{ auth()->guard('agent')->user()->client_email}}" required="">
            </div>
        </div>
        <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="inputPasswordOld">Current Password</label>
                <div class="col-sm-10">
                <input type="password" class="form-control" id="inputPasswordOld" name="inputPasswordOld" required="">
                </div>
        </div>
        <!-- Default switch -->
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="passwordswitch" name="passwordswitch" value='0'>
            <label class="custom-control-label" for="passwordswitch">Password Change</label>
        </div>
        
        <div class="password-box" style="display:none;">
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="inputPasswordNew">New Password</label>
                <div class="col-sm-10">
                <input type="password" class="form-control" id="inputPasswordNew" name ="inputPasswordNew">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="inputPasswordNewVerify">Repeat Password</label>
                <div class="col-sm-10">
                <input type="password" class="form-control" id="inputPasswordNewVerify" name ="inputPasswordNewVerify">
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label"></label>
            <div class="col-sm-10">
            <button type="button" id="accountsettings-submit" class="btn btn-success btn-lg float-right">Update Profile</button>
            </div>
        </div>
    </form>
</div>
@endsection

@section('pageJs')
<script type="text/javascript">
"use strict";
$('#accountsettings-submit').click(function(e){
    e.preventDefault();
    var form = $(this).parents('form');
    Swal.fire({
    title: 'Are you sure to update profile?',
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