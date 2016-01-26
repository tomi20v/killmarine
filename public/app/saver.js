angular.module('Saver', [
    'LocalStorageModule'
])
    .service('Saver', function(SaverData, SaverLogic) {

        return {
            register: function(key, data, whitelist) {
                SaverData.saveRefs[key] = {
                    data: data,
                    whitelist: whitelist
                };
            },
            save: function() {
                return SaverLogic.save();
            },
            load: function(key) {
                return (SaverLogic.get('saveData') || {})[key] || {};
            }
        }

    })
    .service('SaverData', function() {

        return {
            saveRefs: {}
        };

    })
    .service('SaverLogic', function(localStorageService, SaverData) {

        function filter(data, whitelist) {
            var ret = {};
            angular.forEach(data, function(value, key) {
                if (whitelist && (whitelist.indexOf(key) === -1));
                else if (angular.isFunction(value));
                else if (angular.isObject(value)) {
                    ret[key] = filter(value);
                }
                else {
                    ret[key] = value;
                }
            });
            return ret;
        }

        return {
            save: function() {
                var saveData = {};
                angular.forEach(SaverData.saveRefs, function(refData, refKey) {
                    saveData[refKey] = filter(refData.data, refData.whitelist);
                });
                console.log('saved: ', saveData);
                localStorageService.set('saveData', saveData);
            },
            get: function(key) {
                return localStorageService.get(key);
            }
        }

    })
    .service('SaverController', function($scope, SaverLogic) {

        angular.extend($scope, {
            save: function() {
                SaverLogic.save();
            }
        })

    })
;
