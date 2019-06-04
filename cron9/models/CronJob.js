var mongoose = require('mongoose');

var name="CronJob"
var schema = new mongoose.Schema({
    Name : {
        type:String,
        required:true
    },
    Cron : {
        type:String
    },
    ScheduleDate:{
        type:Date
    },
    Timezone:{
        type:String
    },
    Description:{
        type:String
    },
    OnSuccessContacts:{
        type:String
    },
    OnFailureContacts:{
        type:String
    },
    Active:{
        type:Boolean,
        required:true
    },
    CreationDate:{
        type:Date,
        default:Date.now()
    },
    ModificationDate:{
        type:Date
    },
    NumberOfRetries:{
        type:Number,
        required:true,
        default:1
    }
});

var model = mongoose.model(name,schema);

module.exports = {
    model:model,
    schema:schema,
    name:name
}