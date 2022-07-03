let VIDEO = null  //all-caps elements mean they're GLOBAL
let CANVAS = null
let CONTEXT = null
let SCALER = 0.9 //how much of total width we want the video to cover?

const switchCameraButton = document.querySelector('#flip-camera')
const streamDeviceInfo = document.querySelector('#streamDeviceInfo')
let SIZE =  {x:0,y:0,width:0, height:0}
let isCameraFacingUser = true
let CURRENT_SIGNAL = null //global needed to store previous signal since we must STOP all media tracks before switching betweem cameras

function main() {
  CANVAS = document.querySelector('#myCanvas')
  CONTEXT = CANVAS.getContext('2d')


  let promise = navigator.mediaDevices.getUserMedia({video: true})
  promise.then(function(signal) {
     VIDEO = document.createElement('video')



     console.log(signal.getTracks())
     CURRENT_SIGNAL = signal
     const tracks = CURRENT_SIGNAL.getTracks()
    streamDeviceInfo.textContent = tracks[0].label.slice(0, tracks[0].label.indexOf('('))
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
      // VIDEO.setAttribute('autoplay', '');
      // VIDEO.setAttribute('muted', '');

      // VIDEO.setAttribute('playsinline', '')
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
    SIZE.width = resizerRatio * VIDEO.videoWidth //preserves aspect ratio
    SIZE.height = resizerRatio * VIDEO.videoHeight

    SIZE.x = innerWidth / 2 - SIZE.width / 2   //starts at middle of canvas and shifts half its width to left
    SIZE.y = innerHeight / 2 - SIZE.height / 2

      //starts at middle of canvas and shifts half its height to top
}

function updateCanvas() {
  var test = CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height )



  requestAnimationFrame(updateCanvas) //will calls this function recursively (60 FPS if possible)
                                      // which will allow live stream video updates
}
