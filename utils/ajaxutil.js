function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    var apiLayerRegex = /^https:\/\/api.layer.com\/.*/,
        jsonFileRegex = /^.*json$/,
        layerIdentityRegex = /^https:\/\/layer-identity-provider.herokuapp.com\/.*/;

    if (apiLayerRegex.test(options.url) || layerIdentityRegex.test(options.url)) {

    } else if (jsonFileRegex.test(options.url)) {

    } else {
        options.url = 'http://apitest1.servicescheduler.net/' +
            options.url + '?d=IOS&sc=28e336ac6c9423d946ba02dddd6a2632&v=1.4.0&';
    }
});