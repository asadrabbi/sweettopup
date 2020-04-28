<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::namespace('Agent')->as('agent.')->group(function () {
    Route::get('login','LoginController@index')->name('show-login');
    Route::post('post-login', 'LoginController@postLogin')->name('do-login');
    Route::get('dashboard','DashboardController@index')->name('dashboard');
    Route::post('logout','LoginController@logout')->name('logout');

    Route::get('refillrequest','RefillrequestController@index')->name('show-refillrequest');
    Route::post('post-refillrequest', 'RefillrequestController@postRefillrequest')->name('do-refillrequest');

    Route::get('btrequest','BalancetransferrequestController@index')->name('show-btrequest');
    Route::post('post-btrequest', 'BalancetransferrequestController@postBalancetransferrequest')->name('do-btrequest');

    Route::get('updateprofile','UpdateprofileController@index')->name('show-profile');
    Route::post('post-updateprofile', 'UpdateprofileController@postUpdateprofile')->name('do-updateprofile');
    Route::get('pendingtopup','PendingtopupController@index')->name('pendingtopup');
    Route::get('rejectedtopup','RejectedtopupController@index')->name('rejectedtopup');
    Route::get('successfultopup','SuccessfultopupController@index')->name('successfultopup');
    
    Route::get('pendingbt','PendingbtController@index')->name('pendingbt');
    Route::get('rejectedbt','RejectedbtController@index')->name('rejectedbt');
    Route::get('successfulbt','SuccessfulbtController@index')->name('successfulbt');
});

Route::namespace('Admin')->as('admin.')->prefix('admin')->group(function () {
    Route::get('login','LoginController@index')->name('show-login');
    Route::post('post-login', 'LoginController@postLogin')->name('do-login');
    Route::get('dashboard','LoginController@index')->name('dashboard');

});

