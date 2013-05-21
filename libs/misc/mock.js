if(!!getUrlVars().mock && getUrlVars().mock == 'true'){ // hook mock resource if mock flag is set
    jQuery.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        if(!!originalOptions.noFilter) return;
        var mockStrict = getUrlVars().mockStrict == 'true';
        options.timeout = originalOptions.timeout = 400;

        var originalURL = originalOptions.url;
        var serviceResource = null;
        if(!!originalURL.match("sap/sop/services")){
            serviceResource = originalURL.substring(originalURL.lastIndexOf('/')+1).split('.')[0];
        }
        else if(!!originalURL.match("objName=")){
            var isSopServerService = true;
            serviceResource = getUrlVars(originalURL).objName;
        }

        if(!!serviceResource){
            var requestId = getUrlVars(originalURL).id;
            // Add POST prefix on POST requests
            if(!!isSopServerService && originalOptions.type ==='POST' && !!requestId){
                    serviceResource = 'POST_'+serviceResource+'_'+requestId;
                    var isPOST;
            }

            options.url = '/sap/sop/ui/mocks/'+serviceResource+'.json';
            options.type = 'GET';
            options.error = function(xhr, status, error){
                originalOptions.noFilter = true;
                jQuery.ajax(originalOptions);
            };

            if(!!requestId && !mockStrict){
                options.success = function(data){
                    var result = findByKey(data,'id', requestId).item;
                    if(!!result){
                        originalOptions.success.call(originalOptions.context, result);
                    } else{
                        originalOptions.noFilter = true;
                        jQuery.ajax(originalOptions);
                    }
                }
            }
        }
    });
}