/// <reference path="../index.d.ts" />

export class HttpStorage {

    /** @ngInject */
    public constructor(
        protected $localForage,
        protected $q
    ) {

    }

    public get(path: string, storage_ttl: number): ng.IPromise<void> {
        let defered = this.$q.defer();

        if (storage_ttl === 0) {
            defered.reject(false);
        }

        this.$localForage.getItem('jsonapi.' + path + '_lastupdate_time').then (
            success => {
                // is alive the cache?
                if (Date.now() <= (success + storage_ttl * 1000)) {
                    // cache live, then get cached data
                    this.$localForage.getItem('jsonapi.' + path).then (
                        success => {
                            defered.resolve(success);
                        },
                        error => {
                            defered.reject(false);
                        }
                    );
                } else {
                    defered.reject(false);
                }
            },
            error => {
                defered.reject(false);
            }
        );

        return defered.promise;
    }

    public save(path: string, data: string) {
        this.$localForage.setItem('jsonapi.' + path, data);
        this.$localForage.setItem('jsonapi.' + path + '_lastupdate_time', Date.now());
    }
}
angular.module('Jsonapi.services').service('JsonapiHttpStorage', HttpStorage);
