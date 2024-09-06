const miner = require('miner');
const ctrler = require('ctrler');
const config = require('config');

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    miner.check();
    miner.duty_on();
    ctrler.check();
    ctrler.duty_on();
}