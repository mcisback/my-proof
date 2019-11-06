var myWidgetApp = angular.module('widgetApp', [
    'ngAnimate'
])

var widgetCtrl = myWidgetApp.controller(
    'WidgetCtrl',
    ['$scope', '$window', '$interval', '$animate',
    function($scope, $window, $interval, $animate) {
    var widget = this

    const widgetHost = 'http://127.0.0.1:9999'
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

        }
    ]

    $scope.count = 0

    widget.pickRandomPerson = function() {
        let randNumber = Math.floor(Math.random() * $scope.people.length)

        console.log('randNumber is: ', randNumber)

        $scope.person = $scope.people[randNumber]
        console.log('Random Person: ', $scope.person)

        $scope.count++
        console.log('Count is: ', $scope.count)
    }

    $interval(() => {
        widget.pickRandomPerson()
    }, 5000)

    widget.pickRandomPerson()
    // widget.pickRandomPerson()

    console.log('WidgetCtrl, $scope: ', $scope)

}]).directive('animateOnChange', function($timeout) {
    return function(scope, element, attr) {
        scope.$watch(attr.animateOnChange, function(nv,ov) {
            if (nv > ov || nv == 1) {
                console.log('Value Changed')

                console.log('Element is: ', element)

                element.css('opacity', '0')
                element.css('transition', 'all linear 0.5s')
                element.css('opacity', '1')
                
                // element.removeClass('changed-out')

                $timeout(function() {
                    // element.css('opacity', '1')
                    element.css('transition', 'all linear 0.5s')
                    element.css('opacity', '0')
                    // element.addClass('changed-out')
                }, 4000) // Could be enhanced to take duration as a parameter*/
            }
        })
    }
})

angular.element(document).ready(function() {
    var divWidget = document.getElementById('my-get-proof-widget')
    angular.bootstrap(divWidget, ['widgetApp'])
})
