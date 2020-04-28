
<header class="header">
    <nav class="navbar">
        <div class="container-fluid">
        <div class="navbar-holder d-flex align-items-center justify-content-between">
            <div class="navbar-header"><a id="toggle-btn" href="#" class="menu-btn"><i class="fa fa-bars"></i></a>
                <div class="brand-text d-none d-md-inline-block"><strong class="text-primary">{{ auth()->guard($attributes['guard']??'')->user()->client_full_name}}</strong></div></div>

                <div class="d-md-inline-block"><strong class="text-primary"><p>Total Balance:{{number_format((int) (auth()->guard($attributes['guard']??'')->user()->client_credit_all), 2, '.', ',')}}<span>&nbsp; BDT</span></p></strong></div>
            <ul class="nav-menu list-unstyled d-flex flex-md-row align-items-md-center">
            <!-- Log out-->
            <li class="nav-item">
            <a href="{{route('agent.logout')}}" id="logout" class=""><span class="d-none d-sm-inline-block">Logout &nbsp;<i class="fa fa-sign-out"></i></span></a>
            <form id="logout-form" action="{{route('agent.logout')}}" method="POST" style="display: none;">
                {{ csrf_field() }}
            </form>
            </li>
            </ul>
        </div>
        </div>
    </nav>
</header>

@section('headerJs')
<script type="text/javascript">
"use strict";
$('#logout').click(function(e){
    e.preventDefault();
    Swal.fire({
    title: 'Are you sure to logout?',
    //text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm'
    }).then((result) => {
    if (result.value) {
        $('#logout-form').submit();
    }
    })

});
</script>
@endsection