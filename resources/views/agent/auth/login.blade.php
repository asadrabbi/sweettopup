<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>SweetTopUp - Login</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
    <link rel="stylesheet" href="{{asset('assets/bootstrap/css/bootstrap.min.css')}}">
    <!-- Font Awesome CSS-->
    <link rel="stylesheet" href="{{asset('assets/font-awesome/css/font-awesome.min.css')}}">
    <!-- Google fonts - Roboto -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <!-- theme stylesheet-->
    <link rel="stylesheet" href="{{asset('assets/css/style.default.css')}}" id="theme-stylesheet">
    <!-- Custom stylesheet - for your changes-->
    <link rel="stylesheet" href="{{asset('assets/css/custom.css')}}">

    <!------------------------>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
    <body>
        <div class="flex-center position-ref full-height">

            <div class="content">
                <form class="form-1" action="{{route('agent.do-login')}}" method="POST">
                    {{ csrf_field() }}
                    <p class="field">
                        <input type="text" name="username" placeholder="Username">
                        <i class="fa fa-user" aria-hidden="true"></i>
                    </p>
                    <p class="field">
                        <input type="password" name="password" placeholder="Password">
                        <i class="fa fa-key" aria-hidden="true"></i>
                    </p>        
                    <p class="submit">
                        <button type="submit" name="submit"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>
                    </p>
                </form>
                <div class="col-md-12 text-center"><p>Copyright &copy; SweetTopUp</p></div>
            </div>
        </div>
        
    </body>
    
    <!-- JavaScript files-->
    <script type="text/javascript" src="{{asset('assets/jquery/jquery.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/bootstrap/js/bootstrap.min.js')}}"></script>
</html>

