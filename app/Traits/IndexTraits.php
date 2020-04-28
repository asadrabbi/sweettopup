<?php 
 namespace App\Traits;
 use \stdClass;
 use App\Agent;
use App\Inetloadfdr;
 trait IndexTrait
 {
    public function makeSearchQuery($model,$request)     
    {
        if($request->has('query')){
            $queryBag = collect($request->get('query'),[])->get('params',[]);

            foreach ($queryBag as $columnName => $value) {
                if(!strlen($value)){
                   continue;
                }
                if($columnName == 'time'){
                    $timeRange = explode("_",$value);
                    $students = $model->whereBetween('inetload_time', array($timeRange[0],$timeRange[1]));
                }


                if(isset($this->searchField[$columnName])){
                    $searchAttribbute = $this->searchField[$columnName];

                    if( isset($searchAttribbute['query']) && strlen($searchAttribbute['query'])){
                        $append = $searchAttribbute['append']??'';
                        $direction = $searchAttribbute['direction']??null;
                        if($direction=='left'){
                            $value = $append.$value;
                        }else if($direction == 'right'){
                            $value = $value.$append;
                        }else if($direction == 'both'){
                            $value = $append.$value.$append;
                        }

                        if(isset($searchAttribbute['relation']) && isset($searchAttribbute['method'])){
                            $model = $model->{$searchAttribbute['method']}($searchAttribbute['relation'],function($query) use($searchAttribbute,$value,$columnName){
                                $query->where($columnName,$searchAttribbute['query'],$value);
                            });
                        }else{
                            $model = $model->where($columnName,$searchAttribbute['query'],$value);
                        }
                        
                    }else{
                        if(isset($searchAttribbute['relation']) && isset($searchAttribbute['method'])){
                            $model = $model->{$searchAttribbute['method']}($searchAttribbute['relation'],function($query) use($searchAttribbute,$value,$columnName){
                                $query->where($columnName,$value);
                            });
                        }else{
                            $model = $model->where($columnName,$value);
                        }
                        
                    }

                }
            }
            //exit;
        }
        return $model;
    }

    public function makeResponse($paginationObject,$perPage){
        $response = new stdClass;
        $response->meta = new stdClass;
        $response->meta->page = $paginationObject->currentPage();
        $response->meta->pages = $paginationObject->lastPage();
        $response->meta->total = $paginationObject->total();
        $response->meta->perpage = $perPage;
        $response->data = $paginationObject->items();
        return $response;
    }


    public function getSortDirections ($request){
        $sortField = 'inetload_id';
        $sortDirection = 'DESC';
        if($request->has('sort')){
            $sort = $request->get('sort');
            if(array_key_exists('field',$sort)){
                $sortField = $sort['field'];
            }
            if(array_key_exists('sort',$sort)){
                $sortDirection = $sort['sort'];
            }
        }

        return [$sortField,$sortDirection];
    }
    
 }