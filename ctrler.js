const config = require('config');

/**
 * 升级房间控制器
 */
var ctrler = {
    /**
     * 创建一个升级者
     * @param {} home 
     * @param {Array} body 
     * @param {string} name 
     */
    create: function (home, body, name) {
        var newName = name + Game.time; // 生成新的名字
        Game.spawns[home].spawnCreep(body, newName,
            {
                memory: {
                    role: 'ctrler',
                    mineral_sufficient: false,
                }
            });
    },

    /**
     * 检查是否创建新的升级者
     */
    check: function () {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'ctrler');
        if (miners.length < 4) {
            this.create(config.spawns[0], [WORK, CARRY, MOVE], 'ctrler');
        }
    },

    /**
     * 升级者工作
     * @param {Creep} creep 
     */
    work: function (creep) {
        if (creep.memory.mineral_sufficient) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#008c8c' } });
            }
            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.mineral_sufficient = false;
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.mineral_sufficient = true;
            }
        }
    },

    /**
     * 所有升级者工作
     */
    duty_on: function () {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'ctrler') {
                this.work(creep);
            }
        }
    }
}

module.exports = ctrler;