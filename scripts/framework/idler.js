(function () {
    var idler = angular.module('idler', []);
    idler.filter('displayNumber', function () {
        return function (input) {
            input = input || 0;
            if (input < 1000)
                return input.toFixed(2);
            else if (input < 1000000)
                return (input / 1000).toFixed(2) + 'K';
            else if (input < 1000000000)
                return (input / 1000000).toFixed(2) + 'M';
            else if (input < 1000000000000)
                return (input / 1000000000).toFixed(2) + 'B';
            else if (input < 1000000000000000)
                return (input / 1000000000000).toFixed(2) + 'T';
            else if (input < 1000000000000000000)
                return (input / 1000000000000000).toFixed(2) + 'Qt';
            else if (input < 1000000000000000000000)
                return (input / 1000000000000000000).toFixed(2) + 'Qd';
            return input;
        };
    });

    idler.service('idler', ['$interval', 'inventory', function ($interval, inventory) {
        var intervalTime = 1000;

        this.click = function () {
            // do the on-click things
            for (var name in inventory.current) {
                if (inventory.current[name]) {
                    var item = inventory.get(name);
                    if (item.onClick)
                        item.onClick(inventory.current[name]);
                }
            }
        }

        var onInterval = function () {
            // do the on-interval things
            for (var name in inventory.current) {
                if (inventory.current[name]) {
                    var item = inventory.get(name);
                    if (item.onInterval)
                        item.onInterval(inventory.current[name]);
                }
            }
        }

        var interval = $interval(onInterval, intervalTime);

        // TODO - change the interval time?
    }]);

    idler.service('inventory', [function () {
        var current = {};
        var bought = {};
        var inventory = this;
        var definitions = {};

        this.current = current;
        this.bought = bought;
        var costOf = function (name) {
            var item = definitions[name];
            var cost = item.cost;
            if (typeof cost == 'function') {
                cost = cost(current[name] || 0, bought[name] || 0);
            }
            return cost;
        };
        var canBuy = function (name, costRef, count) {
            count = count || 1;
            var cost = costOf(name);
            costRef = costRef || {};
            costRef.cost = cost;
            if (cost != definitions[name].cost && count != 1)
                return false;

            for (var otherName in cost) {
                if (current[otherName] < cost[otherName] * count)
                    return false;
            }

            return true;
        };
        this.canBuy = function (name) { return canBuy(name); };
        this.costOf = function (name) { return costOf(name); };
        this.buy = function (name, count) {
            count = count || 1;
            var costRef = {};
            if (!canBuy(name, costRef, count))
                return false;
            var cost = costRef.cost;

            for (var otherName in cost) {
                current[otherName] -= cost[otherName] * count;
            }
            current[name] += count;
            bought[name] = (bought[name] || 0) + count;
            return true;
        };
        this.add = function (name, count) {
            current[name] += count;
            return count;
        };
        this.set = function (name, data) {
            definitions[name] = data;
            current[name] = data.initial;
        }

        this.get = function (name) {
            if (definitions[name])
                return angular.copy(definitions[name]);
        };
        this.getAll = function () {
            return _.keys(definitions);
        };
    }])
})();