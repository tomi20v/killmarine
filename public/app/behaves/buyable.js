angular.module('BehavesBuyable', ['Meta'])
    /**
     *  example definition in  a module's defs:
     *  {
     *      behaves: {
     *          Buyable: {
     *              module: 'Coin',
     *              // item can be omitted if same as lowercase module
     *              item: 'coin'
     *          }
     *      }
     *  }
     */
    .service('BehavesBuyableLogic', [
        '$injector',
        '$rootScope',
        '$timeout',
        'Util',
        'UtilMath',
        'Meta',
        'BehavesBuyableHelper',
        function(
            $injector, $rootScope, $timeout,
            Util, UtilMath, Meta,
            BehavesBuyableHelper
        ) {

            return function(obj, def, a) {

                var Service = $injector.get(def.module),
                    DataService = $injector.get(def.module + 'Data'),
                    ResourceService = $injector.get(def.behaves.Buyable.resource.module),
                    buy = function(id, cnt, successCallback) {

                        var price = obj.priceOfNext(id, cnt),
                            resource = def.behaves.Buyable.resource;

                        // I'm not sure why but I have to timeout this $emit otherwise angular.forEach()
                        //      breaks in caller method (WTF)
                        $timeout(function() {
                            $rootScope.$emit(resource.module + '.spend', {
                                spend: {
                                    id: resource.id,
                                    cnt: price
                                },
                                success: function () {

                                    LogicService.got(id, cnt, successCallback);

                                }
                            });
                        })

                    };

                return Util.extendWithWrap(obj, {
                    priceOfNext: function(id, cnt) {
                        if (!DataService.defs[id]) {
                            console.log('jajj', DataService, id);
                            return null;
                        }
                        return BehavesBuyableHelper.nextPrice(
                            DataService.owned[id],
                            DataService.defs[id].price,
                            cnt
                        );
                    },
                    canBuy: function(id, cnt) {
                        return this._canBuy(true, id, cnt);
                    },
                    _canBuy: function(prevCan, id, cnt) {
                        if (!prevCan) {
                            return false;
                        }
                        else if (!ResourceService.canSpend(
                                def.behaves.Buyable.resource.id,
                                this.priceOfNext(id, cnt))
                        ) {
                            return false;
                        }
                        return true;
                    },
                    priceOfMaxBuyable: function(id) {
                        var cnt = this.maxBuyable(id);
                        return this.priceOfNext(id, cnt);
                    },
                    maxBuyable: function(id) {
                        var owned = Service.data(['owned', id]),
                            price = Service.data(['defs', id, 'price', 'base']),
                            q = Service.data(['defs', id, 'price', 'q']),
                            ownedPrice = UtilMath.sumGeoSeq(price, q, owned),
                            ownedResource = ResourceService.data(['owned', def.behaves.Buyable.resource.id]);
                        return UtilMath.seqNBySum(ownedPrice + ownedResource, price, q) - owned;
                    },
                    buy: function(id, cnt, successCallback) {
                        var price = obj.priceOfNext(id, cnt),
                            resource = def.behaves.Buyable.resource;

                        // I'm not sure why but I have to timeout this $emit otherwise angular.forEach()
                        //      breaks in caller method (WTF)
                        $timeout(function() {
                            $rootScope.$emit(resource.module + '.spend', {
                                spend: {
                                    id: resource.id,
                                    cnt: price
                                },
                                success: function () {

                                    //this.got(id, cnt, successCallback);
                                    $rootScope.$emit(def.module + '.got', {
                                        id: id,
                                        cnt: cnt,
                                        successCallback: successCallback
                                    });

                                }
                            });
                        })
                    },
                    buyAll: function(id, callback) {
                        console.log('TODO IMPLEMENT buyall()')
                    }
                });

            }

        }
    ])
    .service('BehavesBuyableHelper', [
        'UtilMath',
        function(UtilMath) {

            return {
                nextPrice: function(owned, price, cnt) {
                    var base = price.base,
                        q = price.q,
                        priceWithNextCnt = UtilMath.sumGeoSeq(base, q, owned + cnt),
                        priceOfowned = UtilMath.sumGeoSeq(base, q, owned);
                    return Math.floor(priceWithNextCnt - priceOfowned);
                },
                maxBuyable: function(owned, buyable) {
                    // @todo abstract code here
                }
            };

        }
    ])
    .service('BehavesBuyableController', [
        '$injector',
        '$rootScope',
        function($injector, $rootScope) {

            return function(obj, def) {

                var LogicService = $injector.get(def.module + 'Logic'),
                    Service = $injector.get(def.module),
                    ResourceService = $injector.get(def.behaves.Buyable.resource.module),
                    buyStrategy = {
                        maxBuyable: function(id, cnt) {
                            return cnt;
                        },
                        nextPrice: function(id, cnt) {
                            return LogicService.priceOfNext(id, cnt);
                        },
                        canBuyNext: function(id, cnt) {
                            var nextPrice = this.nextPrice(id, cnt);
                            return nextPrice && ResourceService.canSpend(
                                    def.behaves.Buyable.resource.id,
                                    nextPrice
                                );
                        },
                        buy: function(id, cnt, callback) {
                            return LogicService.buy(id, cnt, callback);
                        }
                    },
                    buyMaxStrategy = angular.extend({}, buyStrategy, {
                        maxBuyable: function(id, cnt) {
                            return LogicService.maxBuyable(id);
                        },
                        nextPrice: function(id) {
                            return LogicService.priceOfNext(id) || LogicService.priceOfNext(id, 1);
                        },
                        buy: function(id, cnt, callback) {
                            return LogicService.buy(id, this.maxBuyable(id), callback);
                        }
                    });

                return angular.extend(obj, {
                    buyable: {
                        buyAtOnce: 1,
                        strategy: buyStrategy,
                        cycleBuyAtOnce: function() {
                            switch (this.buyAtOnce) {
                                case 100:
                                    this.buyAtOnce = 0;
                                    this.strategy = buyMaxStrategy;
                                    break;
                                case 0:
                                    this.buyAtOnce = 1;
                                    this.strategy = buyStrategy;
                                    break;
                                default:
                                    this.buyAtOnce*= 10;
                            }
                            $rootScope.$emit('Meta.usefulClick');
                        },
                        // normal buy, buy as many as specified incurrent buyAtOnce
                        canBuyNext: function(id) {
                            return this.strategy.canBuyNext(id, this.buyAtOnce);
                        },
                        maxBuyable: function(id) {
                            return this.strategy.maxBuyable(id, this.buyAtOnce);
                        },
                        priceOfNext: function(id) {
                            return this.strategy.nextPrice(id, this.buyAtOnce);
                        },
                        buy: function(id) {
                            this.strategy.buy(
                                id,
                                this.buyAtOnce,
                                angular.bind($rootScope, $rootScope.$emit, 'Meta.usefulClick')
                            );
                        },
                        // buy all - buy all available at once
                        canBuyAll: function() {
                            var allPrice = this.priceOfAll();
                            return allPrice && ResourceService.canSpend()
                        },
                        priceOfAll: function() {
                            var allPrice = 0;
                            //angular.forEach(UpgradesData.available, function(upgradeId) {
                            angular.forEach(Service.data('available'), function(availableCnt, id) {
                            //    allPrice+= UpgradesLogic.nextPrice(upgradeId);
                                allPrice+= LogicService.priceOfNext(id, availableCnt);
                            });
                            return allPrice;
                        },
                        buyAll: function() {
                            console.log('@TODO buyAll');
                        },
                        // buy each - buy one of each available at once
                        canBuyEach: function() {
                            var priceOfEach = this.priceOfEach();
                            return  priceOfEach && ResourceService.canSpend(def.behaves.buyable.resource.id, priceOfEach);
                        },
                        priceOfEach: function() {
                            var price = 0;
                            angular.forEach(Service.data('available'), function(availableCnt, id) {
                                if (availableCnt) {
                                    price += LogicService.priceOfNext(id, 1);
                                }
                            });
                            return price;
                        },
                        buyEach: function() {
                            console.log('@TODO buyEach');
                        }
                    }
                })

            }

        }
    ])
;
