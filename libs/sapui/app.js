declareName('app.pics');
app.pics.main = '/SOPWebApplication/AdminUI/secure/images';

$.extend(app, {
    pics:{
        icons:{
            reload: app.pics.main+'/Reload.png',
            trash: app.pics.main+'/trash_icon.png'
        }
    },
    ui:{
        EditDialog: function(sId, mSettings){
            var settingsIndex = typeof(sId)=='object'? 0: 1; // settings index, need to find settings object in the arugments for the c'tor
            mergeDiff(arguments[settingsIndex], {
                followActionEnabled:false,
                updateActionEnabled: false,
                favoriteActionEnabled: false,
                flagActionEnabled:false,
                openButtonVisible:false
            });
            return new sap.ui.ux3.ThingInspector(sId, mSettings);
        },
        input_validation:{
            specialChars: "!@#$%^&*()+=-[]\\\';,./{}|\":<>?",
            validators:{
                notEmpty: function(){
                    if(isEmpty(this.getValue())){
                        throw new ValidationError('Please enter a value for "'+this.x_GetInputTitle('this input')+'".');
                    }
                    return true;
                },
                noSpecialChars: function(){
                    var value = this.getValue(), valLength = value.length || 0;
                    for (var i = 0; i < valLength; i++) {
                        if (sop.ui.input_validation.specialChars.indexOf(value.charAt(i)) != -1) {
                            throw new ValidationError(this.x_GetInputTitle()+" cannot contain any special characters, e.g:!@#$%^\&*()+=-[]\\\\\\\';,.\x2F{}|\\\":\x3C\x3E?~");
                        }
                    }
                    return true;
                },
                lengthBetween: function(min, max){
                    var value = this.getValue();
                    var valueLen = value.toString().length;
                    if(valueLen<min || valueLen>max){
                        throw new ValidationError(this.x_GetInputTitle()+" must be between "+min+" and "+max+".");
                    }
                    return true;
                },
                aName: function(){
                    // TODO: starts with letter?
                    sop.ui.input_validation.validators.lengthBetween.call(this,3,100);
                    //sop.ui.input_validation.validators.notEmpty.call(this);
                    sop.ui.input_validation.validators.noSpecialChars.call(this);
                },
                aDesc: function(){
                    sop.ui.input_validation.validators.lengthBetween.call(this,3,300);
                }
            }
        },
        forms:{
            help:{
                name: 'Enter an alphanumeric value. The name can contain spaces and "_")'
            },
            getHelp: function(fieldType){
                var help = sop.ui.forms.help[fieldType];
                var helpProp = fieldType;
                if(help===undefined){
                    helpProp = fieldType.split('_')[1];
                }
                return sop.ui.forms.help[helpProp];
            }
        }
    },
    regex:{
        //specialChars: "!@#$%^&*()+=-[]\\\';,./{}|\":<>?"
    }
});

declareName('sop.view');
$.extend(sop.view, {
    helpers: {
        dateValue: function(sPath){
            return { path: sPath, type: sop.view.types.Date() };
        },
        showResponseMsg: function(data){
            switch(data.status){
//                case 'SUCCESS':
//                    switch(data.statusReason){
//                        case 'INFO':
//                            iName = 'SUCCESS';
//                            break;
//                    }
//                    break;
                case 'FATAL ERROR':
                    iName = 'ERROR';
                    break;
                default:
                    iName = data.status;
            }
            if(!!data.statusReason.message){
                sui.MsgBoxShow(
                    data.statusReason.message,
                    sap.ui.commons.MessageBox.Icon[iName],
                    data.statusReason.description,
                    [sap.ui.commons.MessageBox.Action.OK]
                );
            }
        }
    }, // END sop.view.helpers
    types: {
        Date: function(oFormatOptions, oConstraints){
            return new sap.ui.model.type.Date(
                $.extend({source: {pattern: "yyyyMMdd"}, pattern: sui.LocaleData().getDatePattern('medium')}, oFormatOptions),
                oConstraints
            );
        }
    } // END sop.view.types
} );