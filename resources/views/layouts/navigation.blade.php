    <!-- Side Navbar -->
    <nav class="side-navbar">
        <div class="side-navbar-wrapper">
          <!-- Sidebar Header    -->
          <div class="sidenav-header d-flex align-items-center justify-content-center">
            <!-- User Info-->
            <div class="sidenav-header-inner text-center">
            <a href="{{ url('/') }}" class="navbar-brand"><h3 class="">SWEETTOPUP</h3></a>
            </div>
            <!-- Small Brand information, appears on minimized sidebar-->
        <div class="sidenav-header-logo"><a href="{{url('/')}}" class="brand-small text-center"><strong class="text-primary">S</strong></a></div>
          </div>
          <!-- Sidebar Navigation Menus-->
          <div class="main-menu">
            <ul id="side-main-menu" class="side-menu list-unstyled">                  
              <li class="{{Route::currentRouteName() == 'agent.dashboard' ? 'active' : '' }}"><a href="{{route('agent.dashboard')}}"><i class="fa fa-tachometer" aria-hidden="true"></i>Dashboard</a></li>
              <li class=""><a href="{{route('agent.show-refillrequest')}}"><i class="fa fa-mobile" aria-hidden="true"></i>Recharge Request</a></li>
              <li class="{{Route::currentRouteName() == 'agent.show-btrequest' ? 'active' : '' }}"><a href="{{route('agent.show-btrequest')}}"><i class="fa fa-mobile" aria-hidden="true"></i>Transfer Now</a></li>
              <li><a href="#exampledropdownDropdown" aria-expanded="false" data-toggle="collapse"><i class="fa fa-pie-chart" aria-hidden="true"></i>Reports</a>
                <ul id="exampledropdownDropdown" class="collapse list-unstyled ">
                  <li class="{{Route::currentRouteName() == 'agent.pendingtopup' ? 'active' : '' }}"><a href="{{route('agent.pendingtopup')}}"><i class="fa fa-clock-o" aria-hidden="true"></i>Pending</a></li>
                  <li class="{{Route::currentRouteName() == 'agent.successfultopup' ? 'active' : '' }}"><a href="{{route('agent.successfultopup')}}"><i class="fa fa-pie-chart" aria-hidden="true"></i>Successfull</a></li>
                  <li class="{{Route::currentRouteName() == 'agent.rejectedtopup' ? 'active' : '' }}"><a href="{{route('agent.rejectedtopup')}}"><i class="fa fa-check-circle"></i>Rejected</a></li>
                  <li class="{{Route::currentRouteName() == 'agent.pendingbt' ? 'active' : '' }}"><a href="{{route('agent.pendingbt')}}"><i class="fa fa-pie-chart" aria-hidden="true"></i>Pending BT Request</a></li>
                  <li class="{{Route::currentRouteName() == 'agent.rejectedbt' ? 'active' : '' }}"><a href="{{route('agent.rejectedbt')}}"><i class="fa fa-pie-chart" aria-hidden="true"></i>Rejected BT Request</a></li>
                  <li class="{{Route::currentRouteName() == 'agent.successfulbt' ? 'active' : '' }}"><a href="{{route('agent.successfulbt')}}"><i class="fa fa-pie-chart" aria-hidden="true"></i>Successful BT Request</a></li>
                </ul>
              </li>
              <li class="{{Route::currentRouteName() == 'agent.show-profile' ? 'active' : '' }}"><a href="{{route('agent.show-profile')}}"><i class="fa fa-lock"></i></i>Update Profile</a></li>
            </ul>
          </div>
          <div class="admin-menu">
          </div>
        </div>
      </nav>