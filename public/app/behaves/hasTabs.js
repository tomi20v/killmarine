/**
 * I provide mixin to handle tabs within a controller
 * could be defined in module's defs.behaves but it's more correct to add
 *      it in the controller as a mixin (eg. you could have 2 controllers
 *      in the same module but only one uses tabs)
 */
angular.module('BehavesHasTabs', [])
    .service('BehavesHasTabsController', [
        'Util',
        function(Util) {

            return function(obj, def) {

                return Util.extendWithWrap(obj, {
                    hasTabs: {
                        tabs: [],
                        activeTab: '',
                        isActiveTab: function(id) {
                            return this.activeTab == id;
                        },
                        setActiveTab: function(id) {
                            this.activeTab = id;
                        },
                        nextTab: function() {
                            var nextKey,
                                currentKey = this.tabs.indexOf(this.activeTab);
                            if (currentKey == -1) {
                                nextKey = 0;
                            }
                            else {
                                nextKey = currentKey + 1;
                                if (nextKey > this.tabs.length) {
                                    nextKey = 0;
                                }
                            }
                            return this.setActiveTab(this.tabs[nextKey]);
                        }
                    }
                })

            }

        }
    ])
;
