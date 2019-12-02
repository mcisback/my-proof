const angularCdn = {
    main: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.8/angular.min.js',
    animate: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.8/angular-animate.min.js'
}

const currentScript = document.currentScript || (function() {
    return document.getElementById('mygetproofid')
})()

const controllerName = 'WidgetCtrl'
const widgetDivId = 'my-get-proof-widget'
const widgetHost = '{{-config.appUrl-}}'
const cssUrl = `${widgetHost}/css/style.css`
const action = currentScript.getAttribute('data-action') || 'None'

function appendToHead(el) {
    return document.getElementsByTagName('head')[0].appendChild(el)
}

function appendToBody(el) {
    return document.getElementsByTagName('body')[0].appendChild(el)
}

function loadScript( url, callback, attrs = [] ) {
    var script = document.createElement( 'script' )
    script.type = 'text/javascript'

    attrs.forEach((attr, i) => {
        console.log(`Set Attr ${attr.name} To: `, attr.value)

        script.setAttribute(attr.name, attr.value)
    })

    if(script.readyState) {  // only required for IE <9
        script.onreadystatechange = function() {
            if ( script.readyState === 'loaded' || script.readyState === 'complete' ) {
                script.onreadystatechange = null
                callback(url)
            }
        }
    } else {  //Others
        script.onload = function() {
            callback(url)
        }
    }

    script.src = url
    document.getElementsByTagName( 'head' )[0].appendChild( script )

    console.log('Loaded Script: ', script)

    return script
}

function getStyle(_styleUrl) {
    var style = document.createElement('link')
    style.setAttribute('rel', 'stylesheet')
    style.setAttribute('href', _styleUrl)

    return style
}

function buildWidgetHtml(callback) {
    var widgetContainer = document.createElement('div')
    widgetContainer.setAttribute('id', widgetDivId)
    widgetContainer.setAttribute('ng-controller', `${controllerName} as widgetCtrl`)
    widgetContainer.setAttribute('animate-on-change', 'count')

    console.log('targetEl is: ', widgetContainer)

    appendToBody(widgetContainer)

    loadTemplate(callback, widgetContainer)
}

function loadTemplate(callback, targetEl) {
    let ajax = new XMLHttpRequest()
    
    ajax.open('GET', `${widgetHost}/widget.html`)
    ajax.send()
    ajax.onreadystatechange=function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            let response = ajax.responseText
            // document.getElementById(controllerName).innerHTML = response
            targetEl.innerHTML = response

            console.log('callback is: ', callback)

            if(callback) {
                console.log('loadTemplate: Calling callback')
                callback()
            } else {
                console.log('loadTemplate: Callback Undefined')
            }
        }
    }
}

// ? If no angular
if(typeof window.angular === 'undefined'){
    //Load AngularJS
    var style = getStyle(cssUrl)
    appendToHead(style)

    var angularJS = loadScript(angularCdn.main, (url) => {
        console.log(`${url} loaded`)

        if(angularJS.complete) {
            document.write = document._write
        } else {
            angularJS.onload = function(){
                setTimeout(function(){
                    document.write = document._write
                }, 0)
            }
        }

        loadScript(angularCdn.animate, (url) => {
            console.log(`${url} loaded`)

            __my_main()
        })
    })

// ? If angular is already present
} else {
    __my_main()
}

function __my_main() {
    buildWidgetHtml(function() {
        var widgetJS = loadScript(
            `${widgetHost}/widget.js`, 
            function(url) {
                console.log(`${url} loaded`)
            },
            [
                {
                    name: 'data-action',
                    value: `${action}`
                },
                {
                    name: 'id',
                    value: 'my-get-proof-widget-id'
                }
            ]
        )
    }, document.getElementById(widgetDivId))
}