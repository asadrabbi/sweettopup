
{!! Form::open(['id' => 'search-form']) !!}
<div class="row">
    @foreach ($attributes['searchField'] as $column => $item)

        @if ( isset($item['active']) && $item['active'] == false)
            @continue
        @endif
        @switch($item['type'])
            @case('text')
            <div class='{{ $item["wrapper_class"]??'col-md-4' }}'>
            <label for="{{Str::title($column)}}">{{ $item["label"]}}</label>
                {!! Form::{$item['type']}($column, $item["default"]??'',[
                        'class' => ($item['class']??'form-control').' table-search',
                        'placeholder' => ($item['placeholder'] ?? Str::title($column)),
                ]) !!}
            </div>
            @break
            @case('select')
                <div class='{{ $item["wrapper_class"]??'col-md-4' }}'>
                    <label for="{{Str::title($column)}}">{{ $item["label"]}}</label>
                    {!! Form::{$item['type']}($column, $item["options"]??[] , $item["default"]??'',[
                        'class' => ($item['class']??'form-control').' table-search',
                    ]) !!}
                </div>
            @break
            @case('date')
                <div class='{{ $item["wrapper_class"]??'col-md-4' }}'>
                    <label for="{{Str::title($column)}}">{{ $item["label"]}}</label>
                    {!! Form::{$item['type']}($column, $item["default"]??'',[
                        'class' => ($item['class']??'form-control').' table-search',
                        'placeholder' => ($item['placeholder'] ?? Str::title($column)),
                    ]) !!}
                </div>
            @break
            @default
        @endswitch
    @endforeach
    <div class='col-md-12 mt-3 text-center'>
        <button id="filterbtn" class="btn btn-primary">Search</button>
    </div>
</div>
{!! Form::close() !!}
