const config = require('config');

/**
 * 矿工模块
 */
var miner = {

    /**
     * 创建一个矿工
     * @param {} home 
     * @param {Array} body 
     * @param {string} name 
     */
    create: function (home, body, name) {
        var newName = name + Game.time; // 生成新的名字
        Game.spawns[home].spawnCreep(body, newName,
            { memory: { role: 'miner' } });
    },

    /**
     * 检查是否创建新的矿工
     */
    check: function () {
        var ctrlers = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        if (ctrlers.length < 3) {
            this.create(config.spawns[0], [WORK, CARRY, MOVE], 'miner');
        }
    },

    /**
     * 矿工工作
     * @param {Creep} creep 
     */
    collect: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    },

    /**
     * 所有矿工工作
     */
    duty_on: function () {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'miner') {
                this.collect(creep);
            }
        }
    },
}

module.exports = miner;