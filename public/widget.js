const getParam = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// ! currentScript could refer to mygetproof.js and not to this script,
// ! if document.currentScript is not supported
// ! But data-action should be the same for both mygetproof.js and widget.js
const personAction = currentScript.getAttribute('data-action')

var myWidgetApp = angular.module('widgetApp', [
    'ngAnimate'
])

myWidgetApp.service('PersonApiService', ['$http', function($http) {
    api = {}

    api.getPerson = function(host) {
        return $http.get(host + '/person')
    }

    return api
}])

var widgetCtrl = myWidgetApp.controller(
    'WidgetCtrl',
    ['$scope', '$window', '$interval', '$animate', 'PersonApiService',
    function($scope, $window, $interval, $animate, PersonApiService) {
    var widget = this

    const widgetHost = '{{-config.appUrl-}}'
    const imgUrl = `${widgetHost}/img/avatar.jpg`

    $scope.people = [
        {
            img: `${imgUrl}`,
            name: 'Giorgio Giovanni',
            action: 'Ha Appena Comprato Power Wireless',
            location: 'Torino, IT'

        },
        {
            img: `${imgUrl}`,
            name: 'Rosalba Greco',
            action: 'Ha Appena Comprato Power Wireless',
            location: 'Milano, IT'

        },
        {
            img: `${imgUrl}`,
            name: 'Minchia Potenza',
            action: 'Ha Appena Comprato Power Wireless',
            location: 'Napoli, IT'

        },
        {
            img: `${imgUrl}`,
            name: 'Asdrubale Lanzipoli',
            action: 'Ha Appena Comprato Power Wireless',
            location: 'Salerno, IT'

        },
        {
            img: `${imgUrl}`,
            name: 'Zanzibar Amubebe',
            action: 'Ha Appena Comprato Power Wireless',
            location: 'Milano, IT'

        }
    ]

    $scope.count = 0
    $scope.intervalTime = 5000

    widget.pickRandomPerson = function() {
        // let randNumber = Math.floor(Math.random() * $scope.people.length)

        // console.log('randNumber is: ', randNumber)

        // $scope.person = $scope.people[randNumber]
        PersonApiService.getPerson(widgetHost)
            .then(resp => {
                $scope.person = resp.data
                $scope.person.action = personAction

                console.log('Random Person: ', $scope.person)

                $scope.count++
                console.log('Count is: ', $scope.count)
            })
    }

    $interval(() => {
        widget.pickRandomPerson()
    }, $scope.intervalTime)

    widget.pickRandomPerson()
    // widget.pickRandomPerson()

    console.log('WidgetCtrl, $scope: ', $scope)

}]).directive('animateOnChange', function($timeout) {
    return function(scope, element, attr) {
        scope.$watch(attr.animateOnChange, function(nv,ov) {
            if (nv > ov || nv == 1) {
                const transitionTime = '0.5'
                const timeoutTime = 4000
                
                console.log('Value Changed')

                console.log('Element is: ', element)

                element.css('opacity', '0')
                element.css('transition', `all linear ${transitionTime}s`)
                element.css('-moz-transition', `all linear ${transitionTime}s`)
                element.css('-webkit-transition', `all linear ${transitionTime}s`)
                element.css('opacity', '1')

                $timeout(function() {
                    element.css('transition', `all linear ${transitionTime}s`)
                    element.css('-moz-transition', `all linear ${transitionTime}s`)
                    element.css('-webkit-transition', `all linear ${transitionTime}s`)
                    element.css('opacity', '0')
                }, timeoutTime) // Could be enhanced to take duration as a parameter*/
            }
        })
    }
})

angular.element(document).ready(function() {
    var divWidget = document.getElementById('my-get-proof-widget')
    angular.bootstrap(divWidget, ['widgetApp'])
})
