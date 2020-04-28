@extends('layouts.master')
@section('title','Dashboard')
@section('content')
@parent
@section('page-header','Dashboard')
@php
$client = [1=>'Reseller',2=>'Agent'];
@endphp
<div class="col-12 col-md-12">
  <table class="table table-bordered table-hover">
    <thead>
    <tr>
        <th>Client ID</th>
        <th>Type</th>
        <th>Total Received</th>
        <th>Total Paid</th>
        <th>Total Used</th>
        <th>Current Balance</th> 	 	 	
    </tr>
    </thead>
    <tbody>
    <tr>
      @foreach($agentdata as $agent)
        <td>{{$agent->client_id}}</td>
        <td>{{$client[$agent->client_type_id]}}</td>
        <td>{{number_format((int)$agent->total_received, 2, '.', ',')}}</td>
        <td>{{number_format((int)$agent->total_paid, 2, '.', ',')}}</td>
        <td>{{number_format((int)$agent->total_used, 2, '.', ',')}}</td>
        <td>{{number_format((int)$agent->client_credit_all, 2, '.', ',')}}</td>
      @endforeach
    </tr>
    </tbody>
  </table>
</div>
@endsection