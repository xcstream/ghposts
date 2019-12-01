var mqtt=require('mqtt')

var client  = mqtt.connect('mqtt://j.appxc.com')
var default_topic = 'xcstream.github.io/ghposts'
var default_topic_boardcast = 'xcstream.github.io/ghpost/boardcasts'
var fs=require('fs')
var storage = require('./storage')
client.on('connect', function () {
    client.subscribe(default_topic)
})

client.on('message', async function (topic, message) {
    var msgbody;
    try{
        msgbody = JSON.parse(message)
    }catch (e) {
        console.log(e)
        return
    }
    if(msgbody.cmd=='init'){
        var tosend ={
            cmd:'update',
            data:storage
        }
        client.publish(msgbody.clientid, JSON.stringify(tosend))
    }
    if(msgbody.cmd=='save'){
        try{
            console.log(msgbody.data)
            var tosend = {
                cmd:'ok'
            }
            storage = JSON.parse(msgbody.data)
            var tosend ={
                cmd:'update',
                data:storage
            }
            fs.writeFileSync(`storage.json`,JSON.stringify(storage))
            client.publish(default_topic_boardcast, JSON.stringify(tosend))

        }catch (e) {
            console.log(e)
        }

    }

})

