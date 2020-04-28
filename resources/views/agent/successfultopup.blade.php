@extends('layouts.master')
@section('pageCss')
@section('title','Successful Top Up')
@endsection


@section('page-header','Successful top Up')

@section('content')

    @if(isset($searchField) && is_array($searchField) && count($searchField))
    <section class="container">
        <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Filter</h5>
                    <hr>
                    <x-data-filter-form :searchField=$searchField/>
                </div>
            </div>
        </div>
        </div>
    </section>
    @endif
    <section class="container">
      <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body" id="successfultopup_table_container">
                    <div class="kt-datatable" id="successfultopup_table"></div>
                </div>
            </div>
        </div>
      </div>
    </section>
@endsection

@section('pageJs')

    <script src="{{ asset('assets/kt-extended/ktdt.js') }}"></script>
    <script src="{{ asset('assets/js/moment.min.js')}}"></script>
    
    <script type="text/javascript">
        "use strict";
        var successfultopup_table;
        successfultopup_table = $("#successfultopup_table").KTDatatable({
            data: {
                type: "remote",
                source: {
                    read: {
                        url: "{{route('agent.successfultopup')}}",
                        method: 'GET',
                        map: function(t) {
                            var e = t;
                            return void 0 !== t.data && (e = t.data), e
                        }
                    }
                },
                pageSize: 10,
                serverPaging: !0,
                serverFiltering: !0,
                serverSorting: !0
            },
            layout: {
                scroll: 1,
                height: 600,
                footer: !1,
                icons:{
                    pagination: {
                        next: 'fa fa-angle-double-right',
                        prev: 'fa fa-angle-double-left',
                        first: 'fa fa-step-backward',
                        last: 'fa fa-step-forward',
                        more: 'fa fa-ellipsis-h'
                    },
                    sort: {
                        asc: 'fa fa-sort-asc',
                        desc: 'fa fa-sort-desc'
                    },
                    rowDetail: {
                        expand: 'fa fa-caret-down',
                        collapse: 'fa fa-caret-right'
                    }
                }
            },
            sortable: !0,
            pagination: !0,
            search: {
                input: $("#generalSearch")
            },
            columns: [
                {
                    field: "serial",
                    title: "Serial",
                    template: function(e, index,datatable) {
                        return ( datatable.getPageSize() * ( datatable.getCurrentPage() - 1) ) + index+1;
                    },
                    width: 60,
                    sortable: !1,
                },
                {
                    field: "inetload_from_user_id",
                    title: "Request From",
                    width: 60,
                    sortable: 1,
                    template: function(e) {
                        if(e.agent != null) return `<span class='text-capitalize'>`+e.agent.client_id+`</span>`;
                        else return "";
	                }
                },{
                    field: "inetload_phn_no",
                    title: "Mobile Number",
                    width: 100,
                },{
                    field: "inetload_amount",
                    title: "Amount",
                    width: 75,
                    template: function(e){
                        return "৳ "+ parseInt(e.inetload_amount);
                    }
                },{
                  field: "operator_type_id",
                  title:"Operator",
                  width: 110,
                  template: function(e) {
                      var operator = ['Grameenphone','Banglalink','Airtel','Robi','Teletalk','Citycell'];
                        if(e.operator_type_id != null){
                            return operator[(e.operator_type_id)-1];
                        }
                        else return "";
                    } 
                },
                /*{
                  field: "client_type",
                  title:"Type",
                  width: 50,
                  template: function(e) {
                      var client = ['Reseller','Agent']
                        if(e.inetload_type_id != null){
                            return client[e.inetload_type_id];
                        }
                        else return "";
                    }
                },*/
                {
                  field: "inetload_time",
                  title:"Request Time",
                  width: 120,
                  sortable: 1,
                  template: function(e) {
                        if(e.inetload_time != null){
                            return (moment.unix(e.inetload_time/1000).format('MMM D, YYYY HH:mm:ss'));
                        }
                        else return "";
                    }
                },{
                  field: "inetload_message",
                  title:"Transictional Message",
                  width: 95,
                  template: function(e) {
                    
                    var message  = e.inetload_message;
                    if(message != null){
                        message = message.trim();
                    }
                    if(message != ""){
                        return `<a href="javascript:void(0)" class="btn" data-toggle="popover" title="Transictional Message" data-trigger="hover" data-content='`+e.inetload_message+`'>Message</a>`;
                    }else{
                        return "";
                    }
                }
                },
                /*{
	                field: "Actions",
	                title: "Actions",
	                sortable: !1,
	                width: 110,
	                overflow: "visible",
	                autoHide: !1,
	                template: function(e) {
                        var baseUrl = "{{ URL::to('asad/agent/') }}"+"/";
	                    return `
                            <a href="`+baseUrl+e.id+`" class="btn btn-outline-info btn-sm" title="View">
                                <i class="icofont-eye-alt"></i>
                            </a>

                            <a href="`+baseUrl+e.id+`/edit" class="btn btn-outline-danger btn-sm" title="Edit">
                                <i class="icofont-edit-alt"></i>
                            </a>

                            <a href="`+baseUrl+e.id+`" class="btn btn-outline-info btn-sm delete-button" title="View" data-delete>
                                <i class="icofont-ui-delete"></i>
                            </a>
                        `
	                }
	            }*/
            ]
        });

        successfultopup_table.on('spinnerCallback',function(object,status){
          if(status){
            $('#successfultopup_table_container').block({
              message:  `<p class="text-center m-0 text-muted p-2"><img src="{{asset('assets/img/load.gif') }}"></p>`,
              theme: true,
              themedCSS: {
                background: '#fff',
                width: '160px',
              }
            });
          }else{
            $('#successfultopup_table_container').unblock();
          }
        });

        /*
        successfultopup_table.on('spinnerCallback',function(object,status){
            $('.delete-button').click(function(event){
                event.preventDefault();
                var form = $("<form></form>");
                form.attr('action',$(this).attr('href'));
                form.attr('method','POST');
                form.append(`<input type="hidden" name="_token" value="{{ csrf_token() }}">`);
                form.append(`<input type="hidden" name="_method" value="DELETE">`);
                $('body').append(form);
                form.trigger('submit');
            });
        });
        */


        successfultopup_table.on('kt-datatable--on-layout-updated',function(){
            $('[data-toggle="popover"]').popover();
        });

        $('#filterbtn').click(function(e){
            e.preventDefault();
            if($('#search-form').length){
                var param = $('#search-form').ktdtSerializeObject();
                var start = param.inetload_time_start;
                var end = param.inetload_time_end
                console.log(moment().format('YYYY-MM-DD'));
                console.log(end);
                if( start != '' ||  end != ''){
                    if(start == ''){
                        start = moment(end, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
                    }
                    if(end == ''){
                        end = moment().format('YYYY-MM-DD');
                    }
                    var starttime = moment(start+' 00:00:00').valueOf();
                    var endtime = moment(end+' 23:59:59').valueOf();
                    var time = starttime+'_'+endtime;
                    param.time = time;
                    delete param['inetload_time_start'];
                    delete param['inetload_time_end'];
                }
                successfultopup_table.search(param, 'params');
            }
        });
    </script>

@endsection