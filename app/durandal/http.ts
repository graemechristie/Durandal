/// <reference path="../lib/jquery.d.ts" />

$.ajax

export function get(url : string) {
    return $.ajax(url, {});
}


export function post(url : string, data : any) {
    return $.ajax(url, {
        data:JSON.stringify(data),
        type:'POST',
        contentType:'application/json',
        dataType:'json'
    });
}
