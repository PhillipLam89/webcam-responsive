let VIDEO = null  //all-caps elements mean they're GLOBAL
let CANVAS = null
let CONTEXT = null
let SCALER = 1 //how much of total width we want the video to cover?

const switchCameraButton = document.querySelector('#flip-camera')

let SIZE =  {x:0,y:0,width:0, height:0}
let isCameraFacingUser = true
let CURRENT_SIGNAL = null //global needed to store previous signal since we must STOP all media tracks before switching betweem cameras

function main() {
  CANVAS = document.querySelector('#myCanvas')
  CONTEXT = CANVAS.getContext('2d')


  let promise = navigator.mediaDevices.getUserMedia({video: true})
  promise.then(function(signal) {
     VIDEO = document.createElement('video')
     CURRENT_SIGNAL = signal
     VIDEO.srcObject = signal
     VIDEO.setAttribute('autoplay', '');
     VIDEO.setAttribute('muted', '');
     VIDEO.setAttribute('playsinline', '')
     VIDEO.play()

     VIDEO.onloadeddata = function() {
         handleResize()
         window.addEventListener('resize', handleResize)
        updateCanvas()
     }
  }).catch(function(err) {
    alert('camera error dude' + err)
  })
}


switchCameraButton.addEventListener('click', function() {
  isCameraFacingUser = !isCameraFacingUser
  const tracks = CURRENT_SIGNAL.getTracks()
  tracks.forEach(track => track.stop())
  promise = navigator.mediaDevices.getUserMedia({video: { facingMode: `${isCameraFacingUser ? 'user' : 'environment'}`}})
    promise.then(function(newSignal) {
      CURRENT_SIGNAL = newSignal
      VIDEO.srcObject = newSignal
      VIDEO.setAttribute('autoplay', '');
      VIDEO.setAttribute('muted', '');
      VIDEO.setAttribute('playsinline', '')
      VIDEO.play()

      VIDEO.onloadeddata = function() {
         handleResize()
         window.addEventListener('resize', handleResize)
         updateCanvas()
     }
    })
})

function handleResize() {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight

      let resizerRatio = SCALER * Math.min(innerWidth/VIDEO.videoWidth, innerHeight/VIDEO.videoHeight)
    SIZE.width = window.innerWidth //preserves aspect ratio
    SIZE.height =window.innerHeight

    SIZE.x = 0   //starts at middle of canvas and shifts half its width to left
    SIZE.y = 0
      //starts at middle of canvas and shifts half its height to top
}

function updateCanvas() {
  CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height )


  requestAnimationFrame(updateCanvas) //will calls this function recursively (60 FPS if possible)
                                      // which will allow live stream video updates
}
