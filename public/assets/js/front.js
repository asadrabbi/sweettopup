$(document).ready(function () {
	
	//-- password
	$("#passwordswitch").click(function(){
        //var switch = $('#passwordswitch');
        var switchval = $('#passwordswitch').val();
        if(switchval == 0){
			$('#passwordswitch').val(1);
			$('#inputPasswordNew').attr("required", true);
			$('#inputPasswordNewVerify').attr("required", true);
		} else {
			$('#passwordswitch').val(0);
			$('#inputPasswordNew').attr("required", false);
			$('#inputPasswordNewVerify').attr("required", false);
		}
		$(".password-box").slideToggle("slow");
	});
	$( ".startdate" ).datepicker({
		inline: true
	});
	$( ".enddate" ).datepicker({
		inline: true
	});
	
	/********************************/
	fill_datatable();
  
  function fill_datatable(startdate = '', enddate = '')
  {
   var dataTable = $('#customer_data').DataTable({
    "processing" : true,
    "serverSide" : true,
    "order" : [],
    "searching" : false,
    "ajax" : {
     url:"rejectedFetch.php",
     type:"POST",
     data:{
      startdate:startdate, enddate:enddate
     }
    }
   });
   
   var dataTable = $('#bt_pending_data').DataTable({
    "processing" : true,
    "serverSide" : true,
    "order" : [],
    "searching" : false,
    "ajax" : {
     url:"pendingbtFetch.php",
     type:"POST",
     data:{
      startdate:startdate, enddate:enddate
     }
    }
   });
   
   
   var dataTable = $('#successful_data').DataTable({
    "processing" : true,
    "serverSide" : true,
    "order" : [],
    "searching" : false,
    "ajax" : {
     url:"successfulFetch.php",
     type:"POST",
     data:{
      startdate:startdate, enddate:enddate
     }
    }
   });
   var dataTable = $('#pending_data').DataTable({
    "processing" : true,
    "serverSide" : true,
    "order" : [],
    "searching" : false,
    "ajax" : {
     url:"pendingFetch.php",
     type:"POST",
     data:{
      startdate:startdate, enddate:enddate
     }
    }
   });
   var dataTable = $('#rejected_bt_request').DataTable({
    "processing" : true,
    "serverSide" : true,
    "order" : [],
    "searching" : false,
    "ajax" : {
     url:"btRejectedFetch.php",
     type:"POST",
     data:{
      startdate:startdate, enddate:enddate
     }
    }
   });
   var dataTable = $('#successful_bt_request').DataTable({
    "processing" : true,
    "serverSide" : true,
    "order" : [],
    "searching" : false,
    "ajax" : {
     url:"btSuccessfulFetch.php",
     type:"POST",
     data:{
      startdate:startdate, enddate:enddate
     }
    }
   });
   var dataTable = $('#refillsummary_data').DataTable({
    "processing" : true,
    "serverSide" : true,
    "order" : [],
    "searching" : false,
    "ajax" : {
     url:"refillSummaryFetch.php",
     type:"POST",
     data:{
      startdate:startdate, enddate:enddate
     }
    }
   });
  }
  
  $('#filter').click(function(){
   var startdate = $('#startdate').val();
   var enddate = $('#enddate').val();
   if(startdate != '' && enddate != '')
   {
    $('#customer_data').DataTable().destroy();
    fill_datatable(startdate, enddate);
   }
   else
   {
    alert('Select Both filter option');
    $('#customer_data').DataTable().destroy();
    fill_datatable();
   }
  });
	/*********************************/
  
  $('#pending_bt_filter').click(function(){
   var startdate = $('#pending_bt_startdate').val();
   var enddate = $('#pending_bt_enddate').val();
   if(startdate != '' && enddate != '')
   {
    $('#bt_pending_data').DataTable().destroy();
    fill_datatable(startdate, enddate);
   }
   else
   {
    alert('Select Both filter option');
    $('#bt_pending_data').DataTable().destroy();
    fill_datatable();
   }
  });
  /***************************************************/
  $('#successful_filter').click(function(){
   var startdate = $('#successful_startdate').val();
   var enddate = $('#successful_enddate').val();
   if(startdate != '' && enddate != '')
   {
    $('#successful_data').DataTable().destroy();
    fill_datatable(startdate, enddate);
   }
   else
   {
    alert('Select Both filter option');
    $('#successful_data').DataTable().destroy();
    fill_datatable();
   }
  });
/*********************************************/
$('#pending_filter').click(function(){
   var startdate = $('#pending_startdate').val();
   var enddate = $('#pending_enddate').val();
   if(startdate != '' && enddate != '')
   {
    $('#pending_data').DataTable().destroy();
    fill_datatable(startdate, enddate);
   }
   else
   {
    alert('Select Both filter option');
    $('#pending_data').DataTable().destroy();
    fill_datatable();
   }
  });
  /*********************************************/
  $('#rejected_bt_filter').click(function(){
   var startdate = $('#rejected_bt_startdate').val();
   var enddate = $('#rejected_bt_enddate').val();
   if(startdate != '' && enddate != '')
   {
    $('#rejected_bt_request').DataTable().destroy();
    fill_datatable(startdate, enddate);
   }
   else
   {
    alert('Select Both filter option');
    $('#rejected_bt_request').DataTable().destroy();
    fill_datatable();
   }
  });
  /********************************************/
    /*********************************************/
  $('#successful_bt_filter').click(function(){
   var startdate = $('#successful_bt_startdate').val();
   var enddate = $('#successful_bt_enddate').val();
   if(startdate != '' && enddate != '')
   {
    $('#successful_bt_request').DataTable().destroy();
    fill_datatable(startdate, enddate);
   }
   else
   {
    alert('Select Both filter option');
    $('#successful_bt_request').DataTable().destroy();
    fill_datatable();
   }
  });
  /********************************************/
    $('#refillsummary_filter').click(function(){
   var startdate = $('#refillsummary_startdate').val();
   var enddate = $('#refillsummary_enddate').val();
   if(startdate != '' && enddate != '')
   {
    $('#refillsummary_data').DataTable().destroy();
    fill_datatable(startdate, enddate);
   }
   else
   {
    alert('Select Both filter option');
    $('#refillsummary_data').DataTable().destroy();
    fill_datatable();
   }
  });
  /********************************************/
  $("#select_all").click(function(){
	  $(".sim_checkbox").prop('checked', $(this).prop('checked'));
  });
    // ------------------------------------------------------- //
    // Custom Scrollbar
    // ------------------------------------------------------ //

    if ($(window).outerWidth() > 992) {
        $("nav.side-navbar").mCustomScrollbar({
            scrollInertia: 200
        });
    }

    // Main Template Color
    var brandPrimary = '#33b35a';

    // ------------------------------------------------------- //
    // Side Navbar Functionality
    // ------------------------------------------------------ //
    $('#toggle-menu').on('click', function (e) {

        e.preventDefault();

        if ($(window).outerWidth() > 1194) {
            $('nav.side-navbar').toggleClass('shrink');
            $('.page').toggleClass('active');
        } else {
            $('nav.side-navbar').toggleClass('show-sm');
            $('.page').toggleClass('active-sm');
        }
    });

    // ------------------------------------------------------- //
    // Tooltips init
    // ------------------------------------------------------ //    

    $('[data-toggle="tooltip"]').tooltip()

    // ------------------------------------------------------- //
    // Universal Form Validation
    // ------------------------------------------------------ //

    $('.form-validate').each(function() {  
        $(this).validate({
            errorElement: "div",
            errorClass: 'is-invalid',
            validClass: 'is-valid',
            ignore: ':hidden:not(.summernote),.note-editable.card-block',
            errorPlacement: function (error, element) {
                // Add the `invalid-feedback` class to the error element
                error.addClass("invalid-feedback");
                //console.log(element);
                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.siblings("label"));
                } 
                else {
                    error.insertAfter(element);
                }
            }
        });
    });
    // ------------------------------------------------------- //
    // Material Inputs
    // ------------------------------------------------------ //

    var materialInputs = $('input.input-material');

    // activate labels for prefilled values
    materialInputs.filter(function () {
        return $(this).val() !== "";
    }).siblings('.label-material').addClass('active');

    // move label on focus
    materialInputs.on('focus', function () {
        $(this).siblings('.label-material').addClass('active');
    });

    // remove/keep label on blur
    materialInputs.on('blur', function () {
        $(this).siblings('.label-material').removeClass('active');

        if ($(this).val() !== '') {
            $(this).siblings('.label-material').addClass('active');
        } else {
            $(this).siblings('.label-material').removeClass('active');
        }
    });

    // ------------------------------------------------------- //
    // Jquery Progress Circle
    /* ------------------------------------------------------ 
    var progress_circle = $("#progress-circle").gmpc({
        color: brandPrimary,
        line_width: 5,
        percent: 80
    });
    progress_circle.gmpc('animate', 80, 3000);

    // ------------------------------------------------------- /*/
    // External links to new window
    // ------------------------------------------------------ //

    $('.external').on('click', function (e) {

        e.preventDefault();
        window.open($(this).attr("href"));
    });

    // ------------------------------------------------------ //
    // For demo purposes, can be deleted
    // ------------------------------------------------------ //

    var stylesheet = $('link#theme-stylesheet');
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    /*if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, {
                expires: 365,
                path: document.URL.substr(0, document.URL.lastIndexOf('/'))
            });

        }

        return false;
    });*/
	

});