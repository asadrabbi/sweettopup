<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\Support\Str;

class DataFilterForm extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('components.filter.data-filter-form');
    }
}