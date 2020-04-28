<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>SweetTopUp - @yield('title')</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
    <link rel="stylesheet" href="{{asset('assets/bootstrap/css/bootstrap.min.css')}}">
    <!-- Font Awesome CSS-->
    <link rel="stylesheet" href="{{asset('assets/font-awesome/css/font-awesome.min.css')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('assets/DataTables/datatables.min.css')}}"/>
    <link rel="stylesheet" type="text/css" href="{{asset('assets/jquery-ui/jquery-ui.css')}}"/>
    <!-- Fontastic Custom icon font-->
    <link rel="stylesheet" href="{{asset('assets/css/fontastic.css')}}">
    <!-- Google fonts - Roboto -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
    <!-- jQuery Circle-->
    <link rel="stylesheet" href="{{asset('assets/css/grasp_mobile_progress_circle-1.0.0.min.css')}}">
    <!-- Custom Scrollbar-->
    <link rel="stylesheet" href="{{asset('assets/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css')}}">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/kt-extended/ktdt.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/1.5.0/css/perfect-scrollbar.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/css/bootstrap-select.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/1.5.0/css/perfect-scrollbar.min.css" />
    <!-- theme stylesheet-->
    <link rel="stylesheet" href="{{asset('assets/css/style.default.css')}}" id="theme-stylesheet">
    <!-- Custom stylesheet - for your changes-->
    <link rel="stylesheet" href="{{asset('assets/css/custom.css')}}">

    <!------------------------>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
<body>
  @include('layouts.navigation')
<div class="page">
  <x-header guard="agent"/>
      <section>
        <div class="container-fluid">
          <!-- Page Header-->
          <header> 
            <h1 class="h3 display">@yield('page-header')</h1>
          </header>
          <div class="row">
            @section('content')
            
            @show
          </div>
        </div>
      </section>
      @include('layouts.footer')
    </div>
    <!-- Main File-->
    
    <!-- JavaScript files-->
    <script type="text/javascript" src="{{asset('assets/jquery/jquery.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/popper.js/umd/popper.min.js')}}"> </script>
    <script type="text/javascript" src="{{asset('assets/bootstrap/js/bootstrap.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/grasp_mobile_progress_circle-1.0.0.min.js')}}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/1.5.0/perfect-scrollbar.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.js"></script>
    <script type="text/javascript" src="{{asset('assets/DataTables/datatables.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/jquery-ui/jquery-ui.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/jquery.cookie/jquery.cookie.js')}}"> </script>
    <script type="text/javascript" src="{{asset('assets/chart.js/Chart.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/jquery-validation/jquery.validate.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js')}}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
    <script type="text/javascript" src="{{asset('assets/js/front.js')}}"></script>
    @yield('pageJs')
    @yield('headerJs')
  </body>
</html>