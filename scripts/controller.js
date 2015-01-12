(function () {
    var game = angular.module('customIdler', ['idler']);
    game.controller('mainController', ['idler', 'inventory', function (idler, inventory) {
        
        this.displayedInventory = 
            [
                '1st Derivative',
                '2nd Derivative',
                '3rd Derivative',
                '4th Derivative',
                'Combinatorics',
                'Probability',
                'NumberTheory',
                'Calculus',
                'HighSchooler',
                'Undergraduate',
                'GraduateStudent',
                'Postdoc'
            ];
        this.click = function () { idler.click(); }
        this.inventory = inventory.current;
        this.purchased = inventory.bought;
        this.canBuy = inventory.canBuy;
        this.costOf = inventory.costOf;
        this.buy = inventory.buy;
        this.definition = inventory.get;
    }]);

    game.run(['inventory', function (inventory) {
        var tickCounter = 0;
        var clickCounter = 0;
        inventory.set('base', {
            description: 'This is the base tracker - counts each time you click. You cannot buy this thing.',
            cost: undefined, // don't try to buy it.
            initial: 1, // start with 1.
            onClick: function (count) { inventory.add('money', 1); clickCounter = (clickCounter + 1) % 25; },
            onInterval: function () { tickCounter = (tickCounter + 1) % 10; }
        });
        inventory.set('money', {
            description: 'This is definition of "money".',
            cost: {}, // doesn't cost anything... should only be able to buy via clicks from the base, though.
            costDisplay: { pre: '$', post: '' },
            initial: 0.1
            // doesn't do anything for clicks or intervals
        });
        inventory.set('proof', {
            description: 'This is definition of "proof".',
            cost: { 'money': 5 },
            costDisplay: { pre: '', post: ' proof' },
            initial: 0
            // doesn't do anything for clicks or intervals
        });
        inventory.set('1st Derivative', {
            name: '1st Derivative',
            description: '0.05$/tick',
            cost: function (currentCount, bought) { return { money: 0.1 + 0.01 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { inventory.add('money', 0.05 * count); }
        });
        inventory.set('2nd Derivative', {
            name: '2nd Derivative',
            description: '1st Derivative/tick',
            cost: function (currentCount, bought) { return { money: 500 + 10 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { inventory.add('1st Derivative', 1 * count); }
        });
        inventory.set('3rd Derivative', {
            name: '3rd Derivative',
            description: '2nd Derivative/tick',
            cost: function (currentCount, bought) { return { money: 20000 + 1000 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { inventory.add('2nd Derivative', 1 * count); }
        });
        inventory.set('4th Derivative', {
            name: '4th Derivative',
            description: '3rd Derivative/tick',
            cost: function (currentCount, bought) { return { money: 1000000 + 100000 * bought * bought, proof: 1000 + 100 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { inventory.add('3rd Derivative', 1 * count); }
        });

        inventory.set('Combinatorics', {
            name: 'Combinatorics',
            description: '1 proof/tick',
            cost: function (currentCount, bought) { return { money: 25000 + 1000 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { inventory.buy('proof', 1 * count); }
        });
        inventory.set('Probability', {
            name: 'Probability',
            description: '1 Combinatorics/10 ticks',
            cost: function (currentCount, bought) { return { money: 20000000 + 1000000 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { if (tickCounter % 10 == 0) inventory.add('Combinatorics', 1 * count); }
        });
        inventory.set('NumberTheory', {
            name: 'Number Theory',
            description: '1 Probability/10 ticks',
            cost: function (currentCount, bought) { return { money: 1000000000 + 500000000 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { if (tickCounter % 10 == 0) inventory.add('Probability', 1 * count); }
        });
        inventory.set('Calculus', {
            name: 'Calculus',
            description: '1 Number Theory/10 ticks',
            cost: function (currentCount, bought) { return { money: 500000000000 + 20000000000 * bought * bought }; },
            initial: 0,
            onInterval: function (count) { if (tickCounter % 10 == 0) inventory.add('NumberTheory', 1 * count); }
        });


        inventory.set('HighSchooler', {
            name: 'High Schooler',
            description: '$0.10/click',
            cost: function (currentCount, bought) { return { money: 5 + 0.1 * bought * bought }; },
            initial: 0,
            onClick: function (count) { inventory.add('money', 0.1 * count); }
        });
        inventory.set('Undergraduate', {
            name: 'Undergraduate',
            description: '1 High Schooler/25 clicks',
            cost: function (currentCount, bought) { return { money: 1000 + 100 * bought * bought }; },
            initial: 0,
            onClick: function (count) { if (clickCounter % 25 == 0) inventory.add('HighSchooler', 1 * count); }
        });
        inventory.set('GraduateStudent', {
            name: 'Graduate Student',
            description: '1 Undergraduate/25 clicks',
            cost: function (currentCount, bought) { return { money: 100000 + 1000 * bought * bought }; },
            initial: 0,
            onClick: function (count) { if (clickCounter % 25 == 0) inventory.add('Undergraduate', 1 * count); }
        });
        inventory.set('Postdoc', {
            name: 'Postdoc',
            description: '1 Graduate Student/25 clicks',
            cost: function (currentCount, bought) { return { money: 10000000 + 100000 * bought * bought }; },
            initial: 0,
            onClick: function (count) { if (clickCounter % 25 == 0) inventory.add('GraduateStudent', 1 * count); }
        });
    }])
})();