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
        'Util',
        'Meta',
        'BehavesBuyableHelper',
        function($injector, Util, Meta, BehavesBuyableHelper) {

            return function(obj, def, a) {

                var DataService = $injector.get(def.module + 'Data'),
                    ResourceService = $injector.get(def.behaves.Buyable.resource.module),
                    buy = function(id, cnt, succesCallback) {

                        var price = obj.priceOfNext(id, cnt),
                            resourceModule = def.behaves.Buyable.resource;

                        // I'm not sure why but I have to timeout this $emit otherwise angular.forEach()
                        //      breaks in caller method (WTF)
                        $timeout(function() {
                            $rootScope.$emit(resourceModule + '.spend', {
                                spend: {
                                    id: def.behaves.Buyable.resource.id,
                                    cnt: price
                                },
                                success: function () {

                                    DataService.topsAdd(['owned', id], cnt);
                                    DataService.topsAdd('ownedAll', cnt);
                                    if (!DataService.firstBuy[id]) {
                                        DataService.firstBuy[id] = Meta.data('playTime');
                                    }
                                    DataService.lastBuy[id] = Meta.data('playTime');

                                    if (angular.isFunction(DataService.defs[id].success)) {
                                        DataService.defs[id].success($rootScope);
                                    }

                                    succesCallback();

                                    $rootScope.$emit(def.module + '.bought', {
                                        id: id,
                                        cnt: cnt
                                    });

                                    obj.refresh();

                                }
                            });
                        })

                    };

                return Util.extendWithWrap(obj, {
                    priceOfNext: function(id, cnt) {
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
                    buy: function(id, cnt, callback) {
                        buy(id, cnt, callback);
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
                    var price = buyable.price,
                        q = buyable.q,
                        ownedPrice = UtilMath.sumGeoSeq(price, q, owned);
                    return UtilMath.seqNBySum(ownedPrice + Player.data('frags'), price, q) - owned;
                }
            };

        }
    ])
;
